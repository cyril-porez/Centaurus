package utils

import (
	"back-end-go/model"
	"errors"
	"regexp"
)

func IsValidateEmailFormat(email string) bool {
	regex := `^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$`
	re := regexp.MustCompile(regex)
	return re.MatchString(email)
}

func ValidateEmailSignin(email string) ([]model.ErrorDetail, error) {
	var details []model.ErrorDetail
	
	if !IsValidateEmailFormat(email) {
		AddErrorDetail(&details, "email", "le format de l'email est invalide")
	}

	if len(details) > 0 {
		return details, errors.New("invalid format email")
	}

	return nil, nil
}
