import { useEffect, useState } from 'react';
import './App.css';

const API = 'http://localhost:8081/api';

function App() {
  const [page, setPage] = useState('home');
  const [books, setBooks] = useState([]);
  const [cart, setCart] = useState([]);
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch(`${API}/books`)
      .then(response => {
        if (!response.ok) throw new Error();
        return response.json();
      })
      .then(setBooks)
      .catch(() => setMessage('Unable to connect to the backend.'));
  }, []);

  const total = cart.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity, 0
  );

  function addToCart(book) {
    setCart(current => {
      const existing = current.find(item => item.id === book.id);

      if (existing) {
        if (existing.quantity >= book.stock) {
          setMessage('Maximum stock reached.');
          return current;
        }

        return current.map(item =>
          item.id === book.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      if (book.stock < 1) {
        setMessage('Book is out of stock.');
        return current;
      }

      return [...current, { ...book, quantity: 1 }];
    });
    setMessage('');
  }

  function updateQuantity(id, quantity) {
    setCart(current => quantity === 0
      ? current.filter(item => item.id !== id)
      : current.map(item => item.id === id
        ? { ...item, quantity }
        : item));
  }

  async function placeOrder(event) {
    event.preventDefault();

    if (!cart.length) {
      setMessage('Your cart is empty.');
      return;
    }

    try {
      const response = await fetch(`${API}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: name,
          deliveryAddress: address,
          items: cart.map(item =>
            `${item.title} x ${item.quantity}`
          ).join(', '),
          totalAmount: Number(total.toFixed(2))
        })
      });

      if (!response.ok) throw new Error('Unable to place order.');

      const order = await response.json();
      setMessage(
        `Order placed successfully! Order ID: ${order.id}. Payment is simulated.`
      );
      setCart([]);
      setName('');
      setAddress('');
    } catch (error) {
      setMessage(error.message);
    }
  }

  return (
    <div className="app">
      <header>
        <h1>BookNest</h1>
        <nav>
          <button onClick={() => setPage('home')}>Home</button>
          <button onClick={() => setPage('books')}>Browse Books</button>
          <button onClick={() => setPage('cart')}>
            Cart ({cart.reduce((sum, item) => sum + item.quantity, 0)})
          </button>
        </nav>
      </header>

      {message && <p className="message">{message}</p>}

      
{page === 'home' && (
  <>
    <main className="home">
      <h2>Find Your Next Favourite Book</h2>
      <p>
        Discover inspiring stories, explore new ideas, and find
        your next great read with BookNest.
      </p>
      <button onClick={() => setPage('books')}>
        Browse Books
      </button>
    </main>

    <main className="featured">
      <h2>Explore Our Collection</h2>
      <p className="featured-intro">
        A few popular picks to get you started.
      </p>

      <div className="book-grid">
        {books.slice(0, 3).map(book => (
          <article className="book-card" key={book.id}>
            <p className="book-category">{book.category}</p>
            <h3>{book.title}</h3>
            <p>By {book.author}</p>
            <h3>₹{Number(book.price).toFixed(2)}</h3>
            <button onClick={() => addToCart(book)}>
              Add to Cart
            </button>
          </article>
        ))}
      </div>

      <button
        className="view-all"
        onClick={() => setPage('books')}
      >
        View All Books
      </button>
    </main>
  </>
)}


      {page === 'books' && (
        <main>
          <h2>Available Books</h2>
          <div className="book-grid">
            {books.map(book => (
              <article className="book-card" key={book.id}>
                <h3>{book.title}</h3>
                <p>Author: {book.author}</p>
                <p>Category: {book.category}</p>
                <p>Price: ₹{Number(book.price).toFixed(2)}</p>
                <p>Stock: {book.stock}</p>
                <button
                  onClick={() => addToCart(book)}
                  disabled={book.stock < 1}
                >
                  Add to Cart
                </button>
              </article>
            ))}
          </div>
        </main>
      )}

      {page === 'cart' && (
        <main>
          <h2>Your Cart</h2>

          {cart.length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (
            <>
              {cart.map(item => (
                <div className="cart-row" key={item.id}>
                  <span>{item.title}</span>
                  <span>₹{Number(item.price).toFixed(2)}</span>
                  <select
                    value={item.quantity}
                    aria-label={`Quantity for ${item.title}`}
                    onChange={event =>
                      updateQuantity(item.id, Number(event.target.value))
                    }
                  >
                    {Array.from(
                      { length: item.stock },
                      (_, index) => index + 1
                    ).map(quantity => (
                      <option key={quantity} value={quantity}>
                        {quantity}
                      </option>
                    ))}
                    <option value="0">Remove</option>
                  </select>
                </div>
              ))}
              <h3>Total: ₹{total.toFixed(2)}</h3>
            </>
          )}

          <h2>Checkout</h2>
          <form onSubmit={placeOrder}>
            <label>
              Full Name
              <input
                required
                value={name}
                onChange={event => setName(event.target.value)}
              />
            </label>

            <label>
              Delivery Address
              <textarea
                required
                value={address}
                onChange={event => setAddress(event.target.value)}
              />
            </label>

            <button type="submit" disabled={cart.length === 0}>
              Place Order
            </button>
          </form>
        </main>
      )}
    </div>
  );
}

export default App;
