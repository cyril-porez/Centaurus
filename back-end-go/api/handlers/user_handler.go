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
//@Tags Credential
//@Accept json
//@Produce json
//@Param user body model.User true "Username, Email and Password"
//@Success 200 {object} model.User "User created successfully"
//@Failure 400 {object} map[string]string
//@Failure 500 {object} map[string]string
//@Router /auth/sign-up [post]
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
//@Description Signin  a user
//@Tags Credential
//@Accept json
//@Produce json
//@Param credential body model.Credential true "Email and password"
//@Success 200 {object} model.Credential "User connected"
//@Failure 400 {object} map[string]string
//@Failure 401 {object} map[sting]string
//@Failure 500 {object} map[string]string
//@Router /auth/sign-in [post]
func SignInHandler(c *gin.Context, db *sql.DB) {
	var signIn model.Credential

	if err := c.ShouldBindJSON(&signIn); err != nil {
		utils.WriteErrorResponse(c, http.StatusBadRequest, "Invalid Request", []utils.ErrorDetail{
			{
				Field: "body",
				Issue: "les données fournies ne sont pas valide",
			},
		})
	}

	if err := service.AuthService(c, db, &signIn); err != nil {
		return
	}

	utils.WriteSuccesResponse(c, http.StatusFound, "user connected with succes", gin.H {
		"user": signIn,
	})
}