CREATE DATABASE musical;
USE musical

CREATE TABLE users(user_id INT PRIMARY KEY auto_increment, email VARCHAR(50) NOT NULL, password VARCHAR(512) NOT NULL, nome VARCHAR(50));
CREATE TABLE albums(
    album_id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    release_date DATE,
    genre VARCHAR(100),
    artist_id INT,
    label VARCHAR(100),
    FOREIGN KEY (artist_id) REFERENCES artists(artist_id)
);
CREATE TABLE artists(
    artist_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    genre VARCHAR(100)
);
CREATE TABLE songs(
    song_id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    duration TIME,
    album_id INT,
    artist_id INT,
    genre VARCHAR(100),
    FOREIGN KEY (album_id) REFERENCES albums(album_id),
    FOREIGN KEY (artist_id) REFERENCES artists(artist_id)
);
CREATE TABLE genres(
    genre_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL
);
CREATE TABLE orders(
    order_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    order_date DATE,
    total DECIMAL(10, 2),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);
CREATE TABLE order_items(
    order_item_id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT,
    song_id INT,
    quantity INT,
    price DECIMAL(10, 2),
    FOREIGN KEY (order_id) REFERENCES orders(order_id),
    FOREIGN KEY (song_id) REFERENCES songs(song_id)
);
CREATE TABLE carts(
    cart_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);
CREATE TABLE cart_items(
    cart_item_id INT PRIMARY KEY AUTO_INCREMENT,
    cart_id INT,
    song_id INT,
    quantity INT,
    price DECIMAL(10, 2),
    FOREIGN KEY (cart_id) REFERENCES carts(cart_id),
    FOREIGN KEY (song_id) REFERENCES songs(song_id)
);
CREATE TABLE payments(
    payment_id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT,
    payment_date DATE,
    amount DECIMAL(10, 2),
    FOREIGN KEY (order_id) REFERENCES orders(order_id)
);
CREATE TABLE reviews(
    review_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    song_id INT,
    rating INT,
    comment TEXT,
    review_date DATE,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (song_id) REFERENCES songs(song_id)
);