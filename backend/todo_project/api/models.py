from django.db import models

class Category(models.Model):

    name = models.CharField(unique=True, null=False)

    def __str__(self):
        return self.name

class Task(models.Model):

    description = models.TextField(null=False)
    is_completed = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    category = models.ForeignKey(
        Category, 
        related_name="tasks", 
        on_delete=models.CASCADE
    )

    def __str__(self):
        if len(self.description) >= 15:
            return self.description[:15] + "..."
        return self.description