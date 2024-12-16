package repository

import (
	"back-end-go/model"
	"database/sql"
)

func InsertUser(db *sql.DB, user *model.User) error {
	query := "INSERT INTO users (username, password, email)	Values (?,?,?)"
	_, err := db.Exec(query, user.Username, user.Password, user.Email)
	return err
}

func IsEmailTaken (db *sql.DB, email string) (bool, error)  {
	var exists bool
	query := "SELECT EXISTS(SELECT 1 FROM users WHERE email = ?)"
	err := db.QueryRow(query, email).Scan(&exists)
	return exists, err
}