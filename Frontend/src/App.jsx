import { useEffect, useState } from 'react';
import './App.css';

const API = 'http://localhost:8081/api';

function App() {
  const [books, setBooks] = useState([]);
  const [cart, setCart] = useState([]);
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch(`${API}/books`)
      .then(response => {
        if (!response.ok) throw new Error('Could not load books');
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
          setMessage('Maximum available stock reached.');
          return current;
        }

        return current.map(item =>
          item.id === book.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      if (book.stock < 1) {
        setMessage('This book is out of stock.');
        return current;
      }

      return [...current, { ...book, quantity: 1 }];
    });

    setMessage('');
  }

  async function placeOrder(event) {
    event.preventDefault();

    if (cart.length === 0) {
      setMessage('Please add a book to your cart.');
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

      if (!response.ok) throw new Error('Order could not be placed.');

      const order = await response.json();

      setMessage(`Order confirmed! Order ID: ${order.id}. Payment is simulated.`);
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
        <a href="#books">Browse Books</a>
        <a href="#cart">Cart ({cart.reduce((n, item) => n + item.quantity, 0)})</a>
      </header>

      <section className="hero">
        <p>WELCOME TO BOOKNEST</p>
        <h2>Find your next favourite book.</h2>
        <p>Discover stories, ideas and inspiration.</p>
        <a className="button" href="#books">Explore Books</a>
      </section>

      {message && <p className="message">{message}</p>}

      <main>
        <section id="books">
          <h2>Our Book Collection</h2>
          <div className="book-grid">
            {books.map(book => (
              <article className="book-card" key={book.id}>
                <div className="book-cover">
                  <span>BOOKNEST</span>
                  <h3>{book.title}</h3>
                </div>
                <p>By {book.author}</p>
                <p className="category">{book.category}</p>
                <strong>₹{Number(book.price).toFixed(2)}</strong>
                <p>{book.stock} in stock</p>
                <button onClick={() => addToCart(book)}>
                  Add to Cart
                </button>
              </article>
            ))}
          </div>
        </section>

        <section id="cart">
          <h2>Your Cart</h2>
          {cart.length === 0 ? <p>Your cart is empty.</p> : (
            <>
              {cart.map(item => (
                <div className="cart-row" key={item.id}>
                  <span>{item.title}</span>
                  <span>₹{Number(item.price).toFixed(2)}</span>
                  <select
                    value={item.quantity}
                    aria-label={`Quantity for ${item.title}`}
                    onChange={event => {
                      const quantity = Number(event.target.value);
                      setCart(current => quantity === 0
                        ? current.filter(book => book.id !== item.id)
                        : current.map(book => book.id === item.id
                          ? { ...book, quantity }
                          : book));
                    }}
                  >
                    {Array.from({ length: item.stock }, (_, i) => i + 1)
                      .map(quantity => (
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

          <form onSubmit={placeOrder}>
            <h2>Checkout</h2>
            <label>
              Full Name
              <input required value={name}
                onChange={event => setName(event.target.value)} />
            </label>
            <label>
              Delivery Address
              <textarea required value={address}
                onChange={event => setAddress(event.target.value)} />
            </label>
            <button type="submit" disabled={cart.length === 0}>
              Confirm Order
            </button>
          </form>
        </section>
      </main>

      <footer>BookNest — Your online bookstore</footer>
    </div>
  );
}

export default App;
