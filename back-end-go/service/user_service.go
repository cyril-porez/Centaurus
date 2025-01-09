package service

import (
	"back-end-go/model"
	"back-end-go/repository"
	"back-end-go/utils"
	"database/sql"

	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
)

func CreateUser(c *gin.Context, db *sql.DB, user *model.User) ([]utils.ErrorDetail, error) {
	var details []utils.ErrorDetail
	
	if det, err := utils.ValidateUsername(db, user.Username); err != nil || len(det) > 0 {
		return append(details, det...), err
	}

	if det, err := utils.ValidateEmail(db, user.Email); err != nil || len(det) > 0 {
		return append(details, det...), err
	}

	if det, err := utils.ValidatePassword(user.Password); err != nil || len(det) > 0 {
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
	if det, err := utils.ValidateEmailSignin(user.Email); err != nil || len(det) > 0 {
		return append(details, det...), err
	}

	if det, err := utils.ValidatePassword(user.Password); err != nil || len(det) > 0 {
		return append(details, det...), err
	}	

	password, err := repository.SelectUserByCredential(db, user)
	if err != nil { 
		utils.AddErrorDetail(&details, "field", "invalid credentials")		
		return details, err
	}

	err = bcrypt.CompareHashAndPassword([]byte(password),[]byte(user.Password))
	if err != nil {
		utils.AddErrorDetail(&details, "field", "invalid credentials")		
		return details, err
	}

	return nil, nil
}