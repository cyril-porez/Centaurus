package model

type Weights struct {
	Id               int    `json:"id"`
	Weight           int    `json:"weight"`
	LastWeight       *int   `json:"lastWeight"`
	DifferenceWeight *int   `json:"diiferenceWeight"`
	LastDate         string `json:"last_date"`
	FkHorseId        int    `json:"fk_horse_id"`
	CreatedAt        string `json:"CreatedAt"`
	UpdatedAt        string `json:"UpdateddAt"`
}

type WeightInput struct {
	Weight    int    `json:"weight" binding:"required"`
	CreatedAt string `json:"CreatedAt"`
}

type WeightData struct {
	Weight    int    `json:"weight"`
	FkHorseId int    `json:"fk_horse_id"`
	CreatedAt string `json:"created_at"`
}

type WeightCreateResponse struct {
	Weight WeightData `json:"weight"`
	Links  Links      `json:"_links"`
	Meta   MetaSimple `json:"meta"`
}

type HorseWeightsResponse struct {
	Horse HorseWeight `json:"horse"`
	Links Links       `json:"_links"`
	Meta  Meta        `json:"meta"`
}

type HorseWeight struct {
	Name             string       `json:"name"`
	Data             []WeightData `json:"data"`
	LastWeight       *int         `json:"last_weight,omitempty"`
	DifferenceWeight *int         `json:"difference_weight,omitempty"`
	LastDate         string       `json:"last_date,omitempty"`
	CreatedAt        string       `json:"created_at,omitempty"`
}