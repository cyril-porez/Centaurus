package handlers

import (
	"back-end-go/model"
	"back-end-go/service"
	"back-end-go/utils"
	"database/sql"
	"net/http"

	"github.com/gin-gonic/gin"
)

//RegisterHandler godoc
//@Summary Register a new user
//@Description Register a new user
//@Tags Users
//@Accept json
//@Produce json
//@Param user body model.User true "User"
//@Success 200 {object} model.User "User created successfully"
//@Failure 400 {object} map[string]string
//@Failure 500 {object} map[string]string
//@Router /auth/register [post]
func RegisterHandler(c *gin.Context, db *sql.DB) {
	var newUser model.User
	if err := c.ShouldBindJSON(&newUser); err != nil {
		utils.WriteErrorResponse(c, http.StatusBadRequest, "Invalid REquest", []utils.ErrorDetail {
			{
				Field: "body",
				Issue: "les données fournies ne sont pas valide",
			},
		})
		return
	}

	if err := service.CreateUser(c, db, &newUser); err != nil {
		return
	}

	utils.WriteSuccesResponse(c, http.StatusCreated, "Utilisateur créé avec succès", gin.H{
		"user": newUser,
	})
}

//SignInHandler godoc
//@Summary Signin a user
//@Description Sign in a user
//@Tags Users
//@Accept json
//@Produce json
//@Param user body model.User true "User"
//@Success 200 {object} model.User "User connected"
//@Failure 400 {object} map[string]string
//@Failure 500 {object} map[string]string
//@Router /auth/sign-in [post]
func SignInHandler(c *gin.Context, db *sql.DB) {

}