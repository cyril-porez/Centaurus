package handlers

import (
	"back-end-go/model"
	"back-end-go/service"
	"back-end-go/utils"
	"database/sql"
	"net/http"
	"strconv"

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
	var user model.Credential

	if err := c.ShouldBindJSON(&user); err != nil {
		utils.WriteErrorResponse(c, http.StatusBadRequest, "Invalid Request", []utils.ErrorDetail{
			{
				Field: "body",
				Issue: "les données fournies ne sont pas valide",
			},
		})
	}

	if err := service.AuthService(c, db, &user); err != nil {
		return
	}

	acceptToken, err := utils.GenerateAccesToken(user.Id, user.Username)
	if err != nil {
		return
	}

	refreshToken, err:= utils.GenerateRefreshToken(user.Id, user.Username)
	if err != nil {
		return
	}

	utils.WriteSuccesResponse(c, http.StatusOK, "user connected with succes", gin.H {
		"user": gin.H{
			"id": user.Id,
			"email": user.Email,
			"username": user.Username,
		},
		"acces_token": acceptToken,
		"refresh_token": refreshToken,
		"_links": gin.H{
			"profile": gin.H{
				"href": "/users/" + strconv.Itoa(user.Id),
				"method": "GET",
			},
			
		},
	})
}