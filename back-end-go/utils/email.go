package utils

import (
	"back-end-go/repository"
	"database/sql"
	"errors"
	"regexp"
)

func IsValidateEmailFormat(email string) bool {
	regex := `^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$`
	re := regexp.MustCompile(regex)
	return re.MatchString(email)
}

func ValidateEmail(db *sql.DB, email string) ([]ErrorDetail ,error) {
	var details []ErrorDetail

	if !IsValidateEmailFormat(email) {
		AddErrorDetail(&details, "email", "le format de l'email est invalide")
	}

	isTaken, err := repository.IsEmailTaken(db, email)
	if err != nil {
		return nil, err
	}
	if isTaken {
		AddErrorDetail(&details, "email", "l'email est déjà utilisé")
	}

	if len(details) > 0 {
		return details, errors.New("invalid format email")
	}

	return nil, nil
}

func ValidateEmailSignin(email string) ([]ErrorDetail, error) {
	var details []ErrorDetail
	
	if !IsValidateEmailFormat(email) {
		AddErrorDetail(&details, "email", "le format de l'email est invalide")
	}

	if len(details) > 0 {
		return details, errors.New("invalid format email")
	}

	return nil, nil
}
