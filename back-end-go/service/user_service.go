package service

import (
	"back-end-go/model"
	"back-end-go/repository"
	"back-end-go/utils"
	"database/sql"
	"errors"
	"net/http"
	"regexp"

	"github.com/gin-gonic/gin"
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

func validatePassword(c *gin.Context, password string) error {
	var details []utils.ErrorDetail
	if len(password ) < 12 {
		details = append(details, utils.ErrorDetail{
			Field: "password",
			Issue: "le mot de passe doit contenir au mois 12 caractères",
		}) 
	}

	if !regexp.MustCompile(`[A-Z]`).MatchString(password) {
		details = append(details, utils.ErrorDetail{
			Field: "password",
			Issue: "le mot de passe doit contenir au moins une majuscule",
		})
	}
	
	if !regexp.MustCompile(`[a-z]`).MatchString(password) {
		details = append(details, utils.ErrorDetail{
			Field: "password",
			Issue: "le mot de passe doit contenir au moins une minuscule",
		})
	}

	if !regexp.MustCompile(`\d`).MatchString(password) {
		details = append(details, utils.ErrorDetail{
			Field: "password",
			Issue: "le mot de passe doit contenir au moins un chiffre",
		})
	}
	
	if !regexp.MustCompile(`[@$!%*?&]`).MatchString(password) {
		details = append(details, utils.ErrorDetail{
			Field: "password",
			Issue: "le mot de passe doit contenir au moins un caractère spéciaux",
		})
	}

	if len(details) > 0 {
		utils.WriteErrorResponse(c, http.StatusBadRequest, "Validation Error ", details)
		return errors.New("invalid password format")
	}

	return nil
}

func CreateUser(c *gin.Context, db *sql.DB, user *model.User) error {

	if err := validateEmail(db, user.Email); err != nil {
		return err
	}

	if err := validatePassword(c, user.Password); err != nil {
		return err
	}

	hashedPAssword, err := utils.HashPassword(user.Password)
	if err != nil {
		return err
	}
	user.Password = string(hashedPAssword)
	return repository.InsertUser(db, user)
}