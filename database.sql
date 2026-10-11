CREATE TABLE book (
    id SERIAL PRIMARY KEY,
    title VARCHAR(100),
    author VARCHAR(100),
    category VARCHAR(50),
    price NUMERIC(10,2),
    stock INT
);

CREATE TABLE customer_order (
    id SERIAL PRIMARY KEY,
    customer_name VARCHAR(100),
    delivery_address TEXT,
    items TEXT,
    total_amount NUMERIC(10,2),
    status VARCHAR(50)
);

INSERT INTO book (title, author, category, price, stock)
VALUES
('Atomic Habits', 'James Clear', 'Self Help', 499, 10),
('The Alchemist', 'Paulo Coelho', 'Fiction', 299, 15),
('Deep Work', 'Cal Newport', 'Productivity', 399, 8),
('Rich Dad Poor Dad', 'Robert Kiyosaki', 'Finance', 349, 12);

SELECT * FROM book;
SELECT * FROM customer_order;
