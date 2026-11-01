-- SQLite Database Schema and Seed Data for Lab 02
-- Course: Backend Development Fundamentals

-- Create Table: book
CREATE TABLE IF NOT EXISTS book (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  price INTEGER NOT NULL,
  pages INTEGER NOT NULL
);

-- Insert 10 Initial Sample Books
INSERT INTO book (title, author, price, pages) VALUES
('Atomic Habits', 'James Clear', 499, 320),
('The Alchemist', 'Paulo Coelho', 299, 208),
('Wings of Fire', 'A.P.J. Abdul Kalam', 350, 180),
('Deep Work', 'Cal Newport', 450, 304),
('Rich Dad Poor Dad', 'Robert Kiyosaki', 399, 336),
('Ikigai', 'Hector Garcia', 320, 208),
('Think and Grow Rich', 'Napoleon Hill', 250, 238),
('The Power of Habit', 'Charles Duhigg', 420, 371),
('Zero to One', 'Peter Thiel', 400, 224),
('Clean Code', 'Robert C. Martin', 850, 464);
