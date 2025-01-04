package repository

import (
	"back-end-go/model"
	"database/sql"
	"time"
)

func InsertUser(db *sql.DB, user *model.User) error {
	user.CreatedAt = time.Now()
	query := "INSERT INTO users (username, password, email, created_at)	Values (?,?,?,?)"
	_, err := db.Exec(query, user.Username, user.Password, user.Email, user.CreatedAt)
	return err
}

func IsEmailTaken (db *sql.DB, email string) (bool, error) {
	var exists bool
	query := "SELECT EXISTS(SELECT 1 FROM users WHERE email = ?)"
	err := db.QueryRow(query, email).Scan(&exists)
	return exists, err
}

func IsUsernameTaken (db *sql.DB, email string) (bool, error) {
	var exists bool
	query := "SELECT EXISTS(SELECT 1 FROM users WHERE username = ?)"
	err := db.QueryRow(query, email).Scan(&exists)
	return exists, err
}

func SelectUserByCredential (db *sql.DB, user *model.Credential) (string, error) {
	var	password string

	query := "SELECT id, username, password FROM users WHERE email = ?"
	err := db.QueryRow(query, user.Email).Scan(&user.Id, &user.Username, &password)

	return password, err	
}