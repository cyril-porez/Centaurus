package service

import (
	"back-end-go/model"
	"back-end-go/repository"
	"database/sql"
)

func CreateUser(db *sql.DB, user *model.User) error {
	return repository.InsertUser(db, user)
}