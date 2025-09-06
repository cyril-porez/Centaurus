package utils

import (
	"net/http"
	"os"
	"time"

	"github.com/gin-gonic/gin"
)

const refreshCookieName = "refresh_token"
// Garde le même path pour set/clear et idéalement égal au préfixe de tes routes auth
const refreshCookiePath = "/api/v1/auth"

// Politique cookie selon environnement
func cookiePolicy() (sameSite http.SameSite, secure bool, domain string) {
	env := os.Getenv("APP_ENV")          // "local" / "dev" / "prod"
	cross := os.Getenv("CROSS_SITE") == "1" // front ≠ API (domaines différents)

	// valeurs par défaut: dev local HTTP, même site
	sameSite = http.SameSiteLaxMode
	secure = false
	domain = "" // mets ton domaine si nécessaire

	// si cross-site (front sur autre domaine), on doit utiliser None + Secure
	if cross {
		sameSite = http.SameSiteNoneMode
		secure = true
	}
	// si prod en HTTPS, force Secure
	if env == "docker" {
		secure = true
	}
	return
}


func SetRefreshCookie(c *gin.Context, token string) error {
	// ss, secure, domain := cookiePolicy()
	c.Header("Cache-Control", "no-store")
	c.Header("Pragma", "no-cache")

	http.SetCookie(c.Writer, &http.Cookie{
		Name:     refreshCookieName,
		Value:    token,
		Path:     refreshCookiePath,
		// Domain:   domain,           // mets-le si tu en utilises un
		Expires:  time.Now().Add((time.Hour * 72)),
		MaxAge:   int((72 * time.Hour).Seconds()),
		HttpOnly: true,
		Secure:   false,
		SameSite: http.SameSiteLaxMode,
	})
	return nil
}

func ClearRefreshCookie(c *gin.Context) {
	// ss, secure, domain := cookiePolicy()
	c.Header("Cache-Control", "no-store")
	c.Header("Pragma", "no-cache")

	// Pour supprimer: même Name/Path/Domain que lors du set + MaxAge<0 (et/ou Expires passé)
	http.SetCookie(c.Writer, &http.Cookie{
		Name:     refreshCookieName,
		Value:    "",
		Path:     refreshCookiePath,
		// Domain:   domain,
		Expires:  time.Unix(0, 0),
		MaxAge:   -1,
		HttpOnly: true,
		Secure:   false,
		SameSite: http.SameSiteLaxMode,
	})
}
