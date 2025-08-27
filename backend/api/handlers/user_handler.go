package handlers

import (
	"back-end-go/model"
	"back-end-go/service"
	"back-end-go/utils"
	"database/sql"
	"errors"
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	// "golang.org/x/text/message"
)

//RegisterHandler godoc
//@Summary Register a new user
//@Description Register a new user
//@Tags Credential
//@Accept json
//@Produce json
//@Param user body model.RegisterInput true "Username, Email and Password"
//@Success 200 {object} model.PublicUser "User created successfully"
//@Failure 400 {object} model.ErrorResponse "Invalid input data"
//@Failure 409 {object} model.ErrorResponse "Email or username already in use"
//@Failure 500 {object} model.ErrorResponse "Internal Server error"
//@Router /api/v1/auth/sign-up [post]
func RegisterHandler(c *gin.Context, db *sql.DB, userService *service.UserService) {
	var input model.RegisterInput

	if err := c.ShouldBindJSON(&input); err != nil {
		utils.WriteErrorResponse(c, http.StatusBadRequest, "Invalid REquest", model.ErrorResponseInput{
			Details : []model.ErrorDetail{
			{
				Field: "body",
				Issue: "The provided data is not valid",
			}},
			Meta : map[string]string{
				"timestamp": "2025-01-03T15:45:00Z",
			},
			Links : gin.H{
				"self":   "/api/v1/auth/signin",
				"Method": "POST",
			},
		})
		return			
	}

	user, details, err := userService.CreateUser(c, db, &input)
	if err != nil || len(details) > 0 {
		code := http.StatusInternalServerError
		message := "Internal Server Error"
		if len(details) > 0 {
			code = http.StatusBadRequest
			message = "Validation Error"
		}
		utils.WriteErrorResponse(c, code, message, model.ErrorResponseInput{
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
		return
	}

	resp := gin.H{
    "user": model.PublicUser{
			Id: user.Id,
      Email: user.Email,
			Username: user.Username,
			CreatedAt: user.CreatedAt,
		},
		"meta": gin.H{
			"createdAt": user.CreatedAt,
			"welcomeMessage": "Welcome to our community", 
		},
		"_links": gin.H{
        "sign-in": gin.H{
					"href":"/api/v1/auth/sign-in", 
					"Method": "POST", 
				},
		},
	}
	utils.WriteSuccesResponse(c, http.StatusCreated, resp)
}

//SignInHandler godoc
//@Summary Signin a user
//@Description Signin  a user
//@Tags Credential
//@Accept json
//@Produce json
//@Param input body model.LoginInput true "Email and password"
//@Success 200 {object} model.PublicUser "User connected"
//@Failure 400 {object} model.ErrorResponse "Validation error"
//@Failure 401 {object} model.ErrorResponse "Unauthorized (bad credentials)"
//@Failure 500 {object} model.ErrorResponse "Internal error"
//@Router /api/v1/auth/sign-in [post]
func SignInHandler(c *gin.Context, db *sql.DB, userService *service.UserService) {
	var input model.LoginInput

	if err := c.ShouldBindJSON(&input); err != nil {
		utils.WriteErrorResponse(c, http.StatusBadRequest, "Invalid Request", model.ErrorResponseInput{
			Details : []model.ErrorDetail{
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
		})
		return
	}

	user, details, err := userService.AuthService(c, db, &input)
	if err != nil || len(details) > 0 {
			code := http.StatusInternalServerError
			message := "Internal Server Error"

			if len(details) > 0 {
				code = http.StatusUnauthorized
				message = "Unauthorized"
			}

			if err != nil && !errors.Is(err, sql.ErrNoRows) {
				code = http.StatusUnauthorized
				message = "Invalid credentials"
			}
			utils.WriteErrorResponse(c, code, message, model.ErrorResponseInput{
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

			return
	}

	accessToken, err := utils.GenerateAccessToken(user.Id, user.Username)
	if err != nil {
		utils.WriteErrorResponse(c, http.StatusInternalServerError, "Token Generation Failed", model.ErrorResponseInput{
			Meta: map[string]string{
				"timestamp": time.Now().Format(time.RFC3339),
			},
		})
		return
	}

	refreshToken, err:= utils.GenerateRefreshToken(user.Id, user.Username)
	if err != nil {
		utils.WriteErrorResponse(c, http.StatusInternalServerError, "Token Generation Failed", model.ErrorResponseInput{
			Meta: map[string]string{
				"timestamp": time.Now().Format(time.RFC3339),
			},
		})
		return
	}
	
	if err := utils.SetRefreshCookie(c, refreshToken); err != nil {
		utils.WriteErrorResponse(c, http.StatusInternalServerError, "Cannot set refresh cookie", model.ErrorResponseInput{
			Meta: map[string]string{ "timestamp": time.Now().UTC().Format(time.RFC3339) },
		})
	}

	resp := gin.H{
		"user": model.PublicUser{
			Id: user.Id,
			Email: user.Email,
			Username: user.Username,
			CreatedAt: user.CreatedAt,
		},
		"meta": gin.H{
			"access_token": accessToken,
			"createdAt": time.Now().UTC().Format(time.RFC3339),
			"message": "You have successfully logged in",
		},
		"_links": gin.H{
			"profile": gin.H{
				"href": "/api/user/" + strconv.Itoa(user.Id),
				"method": "GET",
			},
		},
	}
	c.Header("Cache-Control", "no-store")
	c.Header("Pragma", "no-cache")
	utils.WriteSuccesResponse(c, http.StatusOK, resp)
}


func LogoutHandler(c *gin.Context) {
	http.SetCookie(c.Writer, &http.Cookie{
		Name:     "refresh_token",
		Value:    "",
		Path:     "/",
		Expires:  time.Unix(0, 0),
		MaxAge:   -1,
		HttpOnly: true,
		Secure:   true,                 // adapte selon dev
		SameSite: http.SameSiteNoneMode, // adapte selon contexte
	})
	c.Status(http.StatusNoContent)
}


func RefreshHandler(c *gin.Context) {
	ck, err := c.Request.Cookie("refresh_token")
	if err != nil || ck.Value == "" {
		utils.WriteErrorResponse(c, http.StatusUnauthorized, "No refresh cookie", model.ErrorResponseInput{
			Meta: map[string]string{ "timestamp": time.Now().UTC().Format(time.RFC3339) },
		})
		return
	}

	// TODO: valider le refresh, vérifier révocation/rotation, etc.
	claims, err := utils.ParseRefreshToken(ck.Value)
	if err != nil {
		utils.WriteErrorResponse(c, http.StatusUnauthorized, "Invalid refresh token", model.ErrorResponseInput{
			Meta: map[string]string{ "timestamp": time.Now().UTC().Format(time.RFC3339) },
		})
		return
	}

	userID := int(claims["sub"].(float64))
	username := claims["name"].(string)

	accessToken, err := utils.GenerateAccessToken(userID, username)
	if err != nil {
		utils.WriteErrorResponse(c, http.StatusInternalServerError, "Token Generation Failed", model.ErrorResponseInput{
			Meta: map[string]string{ "timestamp": time.Now().UTC().Format(time.RFC3339) },
		})
		return
	}

	// Optionnel : rotation du refresh → regénérer et reposer un cookie
	// newRefresh, _ := utils.GenerateRefreshToken(userID, username)
	// _ = setRefreshCookie(c, newRefresh)
	c.Header("Cache-Control", "no-store")
	c.Header("Pragma", "no-cache")
	c.Header("Vary", "Origin")

	c.JSON(http.StatusOK, gin.H{
		"access_token": accessToken,
		"createdAt":    time.Now().UTC().Format(time.RFC3339),
	})
}
