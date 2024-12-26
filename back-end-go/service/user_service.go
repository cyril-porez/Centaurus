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


func validateUsername(c *gin.Context ,db *sql.DB, username string) error {
	var details []utils.ErrorDetail
	if !utils.IsUsernameFormatValidate(username) {
		details = append(details, utils.ErrorDetail{
			Field: "username",
			Issue: "le username doit contenir au moins 3 caractère",
		})
	}

	isTaken, err := repository.IsUsernameTaken(db, username)
	if err != nil {
		return err
	}
	if isTaken {
		details = append(details, utils.ErrorDetail{
			Field: "username",
			Issue: "le username est déjà pris",
		})
	}

	if len(details) > 0 {
		utils.WriteErrorResponse(c, http.StatusBadRequest, "validation erro", details)
		return errors.New("invalid format username")
	}
	return nil
}

func validateEmail(c *gin.Context,db *sql.DB, email string) error {
	var details []utils.ErrorDetail
	if !utils.IsValidateEmailFormat(email) {
		details = append(details, utils.ErrorDetail{
			Field: "email",
			Issue: "le format de l'email est invalide",
		})
	}

	isTaken, err := repository.IsEmailTaken(db, email)
	if err != nil {
		return err
	}
	if isTaken {
		return errors.New("l'email est utilisé")
	}

	if len(details) > 0 {
		utils.WriteErrorResponse(c, http.StatusBadRequest,"validation error", details)
		return errors.New("invalid format email")
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
	if err := validateUsername(c, db, user.Username); err != nil {
		return err
	}

	if err := validateEmail(c, db, user.Email); err != nil {
		return err
	}

	if err := validatePassword(c, user.Password); err != nil {
		return err
	}

	hashedPAssword, err := utils.HashPassword(user.Password)
	if err != nil {
		utils.WriteErrorResponse(c, http.StatusInternalServerError, "Internal Server Error", []utils.ErrorDetail {
			{
				Field: "pasword",
				Issue: "erreur lors du hashage du mot de passe",
			},
		}) 
		return err
	}
	user.Password = string(hashedPAssword)
	
	return repository.InsertUser(db, user)
}