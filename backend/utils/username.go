package utils

import (
	"regexp"
)

func IsUsernameFormatValidate(username string) bool {
	regex := `^[a-zA-Z0-9]{3,}$`
	re := regexp.MustCompile(regex)
	return re.MatchString(username)
}
