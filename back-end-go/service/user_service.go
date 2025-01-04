package service

import (
	"back-end-go/model"
	"back-end-go/repository"
	"back-end-go/utils"
	"database/sql"
	"errors"

	"regexp"

	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
)




func validateUsername(db *sql.DB, username string) ([]utils.ErrorDetail ,error) {
	var details []utils.ErrorDetail
	
	isTaken, err := repository.IsUsernameTaken(db, username)
	if err != nil {
		return nil,err
	}
	if isTaken {
		utils.AddErrorDetail(&details, "username", "le username est déjà pris")
	}

	if !utils.IsUsernameFormatValidate(username) {
		utils.AddErrorDetail(&details, "username", "le username doit contenir au moins 3 caractère")
	}

	if len(details) > 0 {
		return details, errors.New("invalid format username")
	}
	return nil, nil
}

func validateEmail(db *sql.DB, email string) ([]utils.ErrorDetail ,error) {
	var details []utils.ErrorDetail

	if !utils.IsValidateEmailFormat(email) {
		utils.AddErrorDetail(&details, "email", "le format de l'email est invalide")
	}

	isTaken, err := repository.IsEmailTaken(db, email)
	if err != nil {
		return nil, err
	}
	if isTaken {
		utils.AddErrorDetail(&details, "email", "l'email est déjà utilisé")
	}

	if len(details) > 0 {
		return details, errors.New("invalid format email")
	}

	return nil, nil
}

func validateEmailSignin(email string) ([]utils.ErrorDetail, error) {
	var details []utils.ErrorDetail
	
	if !utils.IsValidateEmailFormat(email) {
		utils.AddErrorDetail(&details, "email", "le format de l'email est invalide")
	}

	if len(details) > 0 {
		return details, errors.New("invalid format email")
	}

	return nil, nil
}

func validatePassword(password string) ([]utils.ErrorDetail, error) {
	var details []utils.ErrorDetail
	
	if len(password ) < 12 { 
		utils.AddErrorDetail(&details, "password", "le mot de passe doit contenir au mois 12 caractères")
	}

	if !regexp.MustCompile(`[A-Z]`).MatchString(password) {
		utils.AddErrorDetail(&details, "password", "le mot de passe doit contenir au mois 12 caractères")
	}
	
	if !regexp.MustCompile(`[a-z]`).MatchString(password) {
		utils.AddErrorDetail(&details, "password", "le mot de passe doit contenir au moins une minuscule")
	}

	if !regexp.MustCompile(`\d`).MatchString(password) {
		utils.AddErrorDetail(&details, "password", "le mot de passe doit contenir au moins un chiffre")
	}
	
	if !regexp.MustCompile(`[@$!%*?&]`).MatchString(password) {
		utils.AddErrorDetail(&details, "password", "le mot de passe doit contenir au moins spéciaux")
	}

	if len(details) > 0 {
		return details, errors.New("invalid password format")
	}

	return nil, nil
}


func CreateUser(c *gin.Context, db *sql.DB, user *model.User) ([]utils.ErrorDetail, error) {
	var details []utils.ErrorDetail
	
	if det, err := validateUsername(db, user.Username); err != nil || len(det) > 0 {
		return append(details, det...), err
	}

	if det, err := validateEmail(db, user.Email); err != nil || len(det) > 0 {
		return append(details, det...), err
	}

	if det, err := validatePassword(user.Password); err != nil || len(det) > 0 {
		return append(details, det...),err
	}

	hashedPAssword, err := utils.HashPassword(user.Password)
	if err != nil {
		utils.AddErrorDetail(&details, "password", "erreur lors du hashage du mot de passe")
		return details, err
	}
	user.Password = hashedPAssword
	
	if err := repository.InsertUser(db, user); err != nil {
		return nil, err
	}

	return nil, nil
}

func AuthService(c *gin.Context, db *sql.DB, user *model.Credential) ([]utils.ErrorDetail, error) {
	var details []utils.ErrorDetail
	if det, err := validateEmailSignin(user.Email); err != nil || len(det) > 0 {
		return append(details, det...), err
	}

	if det, err := validatePassword(user.Password); err != nil || len(det) > 0 {
		return append(details, det...), err
	}	

	password, err := repository.SelectUserByCredential(db, user)
	if err != nil { 
		return nil, err
	}

	err = bcrypt.CompareHashAndPassword([]byte(password),[]byte(user.Password))
	if err != nil {
		utils.AddErrorDetail(&details, "field", "invalid credentials")		
		return nil, errors.New("user not found or invalid credential")
	}

	return nil, nil
}