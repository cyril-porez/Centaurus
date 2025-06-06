package model

type Horses struct {
	Id        int       `json:"id"`
	Name      string    `json:"name" binding:"required"`
	Age       int       `json:"age" binding:"required"`
	Race      string    `json:"race" binding:"required"`
	FkUserId  int       `json:"fk_user_id" binding:"required"`
	CreatedAt string    `json:"createdAt"`
	UpdatedAt string    `json:"updatedAt"`
}