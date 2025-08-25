package interfaces

import (
	"back-end-go/model"
	"database/sql"
)

type UserRepository interface {
	InsertUser(db *sql.DB, user *model.User) error
	IsEmailTaken(db *sql.DB, email string) (bool, error)
	IsUsernameTaken(db *sql.DB, email string) (bool, error)
	SelectUserByCredential(db *sql.DB, email string) (*model.User, string, error)
}