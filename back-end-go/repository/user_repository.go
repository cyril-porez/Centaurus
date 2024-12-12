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