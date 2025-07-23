package model

type Horses struct {
	Id        int    `json:"id"`
	Name      string `json:"name" binding:"required"`
	Age       int    `json:"age" binding:"required"`
	Race      string `json:"race" binding:"required"`
	FkUserId  int    `json:"fk_user_id" binding:"required"`
	CreatedAt string `json:"createdAt"`
	UpdatedAt string `json:"updatedAt"`
}

type HorseUpdate struct {
	Name      string `json:"name" binding:"required"`
	Age       int    `json:"age" binding:"required"`
	Race      string `json:"race" binding:"required"`
	UpdatedAt string `json:"updatedAt"`
}

type HorseData struct {
	Data []Horses `json:"data"`
}

type Link struct {
	Method string `json:"method"`
	Href   string `json:"href"`
}

type Links struct {
	SignIn Link `json:"sign-in"`
}

type Meta struct {
	Count          int    `json:"count"`
	WelcomeMessage string `json:"welcomeMessage"`
}

type HorsesResponse struct {
	Horse HorseData `json:"horse"`
	Links Links     `json:"_links"`
	Meta  Meta      `json:"meta"`
}