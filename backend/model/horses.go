package model

type Horses struct {
	Id        int    `json:"id"`
	Name      string `json:"name" binding:"required"`
	Age       int    `json:"age" binding:"required"`
	Race      string `json:"race" binding:"required"`
	FkUserId  int    `json:"fk_user_id" binding:"required"`
	CreatedAt string `json:"createdAt"`
	UpdatedAt string `json:"updatedAt,omitempty"`
}

type HorseInput struct {
	Name     string `json:"name" binding:"required"`
	Age      int    `json:"age" binding:"required"`
	Race     string `json:"race" binding:"required"`
	FkUserId int    `json:"fk_user_id"`
}

type HorseUpdateInput struct {
	Name string `json:"name" binding:"required"`
	Age  int    `json:"age" binding:"required"`
	Race string `json:"race" binding:"required"`
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
	Update Link `json:"update"`
	Get    Link `json:"get"`
}

type Meta struct {
	Count   int    `json:"count"`
	Message string `json:"welcomeMessage"`
}

type MetaSimple struct {
	Message string `json:"message"`
}

type HorseCreateResponse struct {
	Horse Horses     `json:"horse"`
	Links Links      `json:"_links"`
	Meta  MetaSimple `json:"meta"`
}

type HorseUpdateResponse struct {
	Horse HorseUpdate `json:"horse"`
	Links Links       `json:"_links"`
	Meta  Meta        `json:"meta"`
}

type HorsesResponse struct {
	Horse HorseData `json:"horse"`
	Links Links     `json:"_links"`
	Meta  Meta      `json:"meta"`
}