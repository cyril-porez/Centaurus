package utils

import (
	"net/http"
	"os"
	"time"

	"github.com/gin-gonic/gin"
)

func SetRefreshCookie(c *gin.Context, token string) error {
	// Détermine le contexte (dev/prod et même/différent domaine)
	isProd := os.Getenv("APP_ENV") == "local"
	isCrossSite := os.Getenv("CROSS_SITE") == "1" // front sur un autre domaine/port

	sameSite := http.SameSiteLaxMode
	secure := false // true en prod https
	if isCrossSite {
		sameSite = http.SameSiteNoneMode
		secure = true // requis par les navigateurs pour SameSite=None
	}
	if isProd {
		secure = true
	}

	cookie := &http.Cookie{
		Name:     "refresh_token",
		Value:    token,
		Path:     "/api/v1/auth",
		Expires:  time.Now().Add(72 * time.Hour),
		MaxAge:   int((72 * time.Hour).Seconds()),
		HttpOnly: true,
		Secure:   secure,
		SameSite: sameSite,
		// Domain: "api.mondomaine.com", // mets-le seulement si nécessaire
	}
	http.SetCookie(c.Writer, cookie)
	return nil
}
