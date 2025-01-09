package utils

import (
	"errors"
	"regexp"

	"golang.org/x/crypto/bcrypt"
)


func HashPassword(password string) (string, error) {
	hashedPAssword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	return string(hashedPAssword), err
}

func ValidatePassword(password string) ([]ErrorDetail, error) {
	var details []ErrorDetail
	
	if len(password ) < 12 { 
		AddErrorDetail(&details, "password", "le mot de passe doit contenir au mois 12 caractères")
	}

	if !regexp.MustCompile(`[A-Z]`).MatchString(password) {
		AddErrorDetail(&details, "password", "le mot de passe doit contenir au mois 12 caractères")
	}
	
	if !regexp.MustCompile(`[a-z]`).MatchString(password) {
		AddErrorDetail(&details, "password", "le mot de passe doit contenir au moins une minuscule")
	}

	if !regexp.MustCompile(`\d`).MatchString(password) {
		AddErrorDetail(&details, "password", "le mot de passe doit contenir au moins un chiffre")
	}
	
	if !regexp.MustCompile(`[@$!%*?&]`).MatchString(password) {
		AddErrorDetail(&details, "password", "le mot de passe doit contenir au moins un caractère spéciaux")
	}

	if len(details) > 0 {
		return details, errors.New("invalid password format")
	}

	return nil, nil
}