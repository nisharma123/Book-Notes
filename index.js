import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

app.set('view engine', 'ejs');

// Set the MIME type for CSS files
app.use(express.static('public', { 
  setHeaders: (res, path) => {
    if (path.endsWith('.css')) {
      res.setHeader('Content-Type', 'text/css');
    }
  }
}));

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "Book-Notes",
  password: "GingerNishtha",
  port: 5432,
});
db.connect();

app.use(bodyParser.urlencoded({ extended: true })); 

let items = [{
    id: 1,
    book_title: 'Harry Potter and the Philosphers Stone',
    author: 'J.K Rowling',
    rating: 4.5,
    review: 'Harry Potter and the Philosophers Stone is a fantasy novel written by the British author J. K. Rowling. It is the first novel in the Harry Potter series and was Rowlings debut novel. It follows Harry Potter, a young wizard who discovers his magical heritage on his eleventh birthday when he receives a letter of acceptance to Hogwarts School of Witchcraft and Wizardry. Harry makes close friends and a few enemies during his first year at the school. With the help of his friends, Ron Weasley and Hermione Granger, he faces an attempted comeback by the dark wizard Lord Voldemort, who killed Harrys parents but failed to kill Harry when he was just 15 months old.',
    book_cover: 'https://m.media-amazon.com/images/I/91wKDODkgWL.jpg'
}];


app.get("/", async (req, res) => {
    try {
        const result = await db.query("SELECT * FROM book_notes ORDER BY id ASC");
        const items = result.rows;
        // console.log("Fetched items:", items); // Log the fetched data
        res.render("index.ejs", 
            { 
                listItems: items 
            });
        } catch (err) {
          console.error("Error fetching books:", err);
          res.status(500).send('Error fetching books.');
        }
});

app.get('/edit/:id', async(req, res) => {
    try {
        const bookId = req.params.id;
        console.log(bookId)
        const result = await db.query("SELECT * FROM book_notes WHERE id=$1", [bookId]);
        const book = result.rows[0];
        console.log(book)

    res.render("form.ejs", {
        bookId: bookId,
        bookTitle: book.book_title,
        author: book.author,
        ratings: book.ratings,
        review: book.review,
        bookCover: book.book_cover
    });
    } catch (err) {
        console.log(err)
    }
})

app.post('/submit', async(req, res) => {
    try {
        const { book_title, author, ratings, review, book_cover } = req.body;
        const bookId = req.body.id;
        if (bookId) {
            await db.query("UPDATE book_notes SET book_title = $1, author = $2, rating = $3, review = $4, book_cover = $5 WHERE id=$6", 
                [book_title, author, ratings, review, book_cover, bookId]);
                res.redirect("/")
        } else {
            await db.query("INSERT INTO book_notes (book_title, author, rating, review, book_cover) VALUES ($1, $2, $3, $4, $5)", [book_title, author, ratings, review, book_cover])
            console.log(req.body);
            const result = db.query("SELECT * FROM book_notes ORDER BY id ASC");
            items = result.rows;
            console.log(items)

            res.redirect('/');

            res.render("form.ejs", {
                bookTitle: book_title,
                author: author,
                ratings: ratings,
                review: review,
                bookCover: book_cover,
                bookId: bookId
    });
        };

    } catch (err) {
        console.log(err);
    }
});

app.get("/delete/:id", async (req, res) => {
    try {
        const bookId = req.params.id;
        await db.query("DELETE FROM book_notes WHERE id = $1", [bookId]);
        res.redirect("/")
    } catch (err) {
        console.log(err);
    }
});

app.get('/add-book', (req, res) => {
    res.render('add_book.ejs');
});


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});