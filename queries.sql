-- Create table book-notes --
CREATE TABLE book_notes (
	id SERIAL PRIMARY KEY,
	book_title VARCHAR(100),
	author VARCHAR(100),
	rating FLOAT,
	review TEXT,
	book_cover TEXT
);
-- Insert into book-notes --
INSERT INTO book_notes (book_title, author, rating, review, book_cover) 
VALUES ('Harry Potter and the Philosphers Stone', 'J.K Rowling', 4.5, 'Harry Potter and the Philosophers Stone is a fantasy novel written by the British author J. K. Rowling. It is the first novel in the Harry Potter series and was Rowlings debut novel. It follows Harry Potter, a young wizard who discovers his magical heritage on his eleventh birthday when he receives a letter of acceptance to Hogwarts School of Witchcraft and Wizardry. Harry makes close friends and a few enemies during his first year at the school. With the help of his friends, 
		Ron Weasley and Hermione Granger, he faces an attempted comeback by 
		the dark wizard Lord Voldemort, who killed Harrys parents but failed to kill Harry when he was just 15 months old.', 'https://m.media-amazon.com/images/I/91wKDODkgWL.jpg');
