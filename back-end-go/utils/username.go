package utils

import (
	"back-end-go/repository"
	"database/sql"
	"errors"
	"regexp"
)

func IsUsernameFormatValidate(username string) bool {
	regex := `^[a-zA-Z0-9]{3,}$`
	re := regexp.MustCompile(regex)
	return re.MatchString(username)
}

func ValidateUsername(db *sql.DB, username string) ([]ErrorDetail ,error) {
	var details []ErrorDetail
	
	isTaken, err := repository.IsUsernameTaken(db, username)
	if err != nil {
		return nil,err
	}
	if isTaken {
		AddErrorDetail(&details, "username", "le username est déjà pris")
	}

	if !IsUsernameFormatValidate(username) {
		AddErrorDetail(&details, "username", "le username doit contenir au moins 3 caractères")
	}

	if len(details) > 0 {
		return details, errors.New("invalid format username")
	}
	return nil, nil
}