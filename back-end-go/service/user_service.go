package service

import (
	"back-end-go/model"
	"back-end-go/repository"
	"back-end-go/utils"
	"database/sql"
	"errors"
)


func validateEmail(db *sql.DB, email string) error {
	if !utils.IsValidateEmailFormat(email) {
		return errors.New("le format de l'email est invalide")
	}

	isTaken, err := repository.IsEmailTaken(db, email)
	if err != nil {
		return err
	}
	if isTaken {
		return errors.New("l'email est utilisé")
	}
	return nil
}

func CreateUser(db *sql.DB, user *model.User) error {

	if err := validateEmail(db, user.Email); err != nil {
		return err
	}

	hashedPAssword, err := utils.HashPassword(user.Password)
	if err != nil {
		return err
	}
	user.Password = string(hashedPAssword)
	return repository.InsertUser(db, user)
}