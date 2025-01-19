package handlers

import (
	"back-end-go/model"
	"back-end-go/service"
	"back-end-go/utils"
	"database/sql"
	"net/http"
	"strconv"
	"time"

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
//@Router /api/v1/auth/sign-up [post]
func RegisterHandler(c *gin.Context, db *sql.DB) {
	var newUser model.User
	if err := c.ShouldBindJSON(&newUser); err != nil {
		body := utils.ErrorResponseInput{
			Details : []utils.ErrorDetail{
				{
					Field: "body",
					Issue: "The provided data is not valid",
				},
			},
			Meta : map[string]string{
				"timestamp": "2025-01-03T15:45:00Z",
			},
			Links : gin.H{
				"self":   "/api/v1/auth/signin",
				"Method": "POST",
			},
		}
		utils.WriteErrorResponse(c, http.StatusBadRequest, "Invalid REquest", body)
		return
	}

	if details, err := service.CreateUser(c, db, &newUser); err != nil || len(details) > 0 {
		if len(details) > 0 {
			utils.WriteErrorResponse(c, http.StatusBadRequest, "Validation Error", utils.ErrorResponseInput{
				Details: details,
				Meta: map[string]string{
					"timestamp": time.Now().Format(time.RFC3339),
				},
				Links : gin.H{
					"sign-in": gin.H{
						"self":   "/api/v1/auth/signin",
						"METHOD": "POST",
					},
				},
			})
		} else {
			utils.WriteErrorResponse(c, http.StatusInternalServerError, "internal Server Error", utils.ErrorResponseInput{
				Meta: map[string]string{
					"timestamp": time.Now().Format(time.RFC3339),
				},
				Links : gin.H{
					"sign-in": gin.H{
						"self":   "/api/v1/auth/signin",
						"METHOD": "POST",
					},
				},
			})
		}
		return
	}

	body := gin.H{
    "user": gin.H{
      "email": newUser.Email,
			"username": newUser.Username,
		},
		"_links": gin.H{
        "sign-in": gin.H{
					"href":"/api/v1/auth/sign-in",
					"Method": "POST", 
				},
		},
		"meta": gin.H{
			"createdAt": newUser.CreatedAt,
			"welcomeMessage": "Welcome to our community", 
		},
	}

	utils.WriteSuccesResponse(c, http.StatusCreated, "Registration successful", body)
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
//@Router /api/v1/auth/sign-in [post]
func SignInHandler(c *gin.Context, db *sql.DB) {
	var user model.Credential

	if err := c.ShouldBindJSON(&user); err != nil {
		body := utils.ErrorResponseInput{
			Details : []utils.ErrorDetail{
				{
					Field: "body",
					Issue: "The provided data is not valid",
				},
			},	
			Meta : map[string]string{
				"timestamp": "2025-01-03T15:45:00Z",
			},	
			Links : gin.H{
				"sign-in": gin.H{
					"self":   "/api/v1/auth/signin",
					"METHOD": "POST",
				},
			},
		}
		utils.WriteErrorResponse(c, http.StatusBadRequest, "Invalid Request", body)
	}

	if details, err := service.AuthService(c, db, &user); err != nil || len(details) > 0 {
		if len(details) > 0 {
			utils.WriteErrorResponse(c, http.StatusUnauthorized, "Unauthorized", utils.ErrorResponseInput{
				Details: details,
				Meta: map[string]string{
					"timestamp": time.Now().Format(time.RFC3339),
				},
				Links : gin.H{
					"sign-up": gin.H{
						"self":   "/api/v1/auth/signup",
						"METHOD": "POST",
					},
				},
			})
		} else {
			utils.WriteErrorResponse(c, http.StatusInternalServerError, "Internal server", utils.ErrorResponseInput{
				Meta: map[string]string{
					"timestamp": time.Now().Format(time.RFC3339),
				},
				Links : gin.H{
					"sign-up": gin.H{
						"self":   "/api/v1/auth/signup",
						"METHOD": "POST",
					},
				},
			})
		}
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

	body := gin.H{
		"user": gin.H{
			"id": user.Id,
			"email": user.Email,
			"username": user.Username,
		},
		"meta": gin.H{
			"acces_token": acceptToken,
			"refresh_token": refreshToken,
			"createdAt": time.Now(),
			"message": "You have successfully logged in",
		},
		"_links": gin.H{
			"profile": gin.H{
				"href": "/api/user/" + strconv.Itoa(user.Id),
				"method": "GET",
			},
		},
	}

	utils.WriteSuccesResponse(c, http.StatusOK, "login successful", body)
}