from django.contrib.gis.db import models

class Boundary(models.Model):
    geom = models.MultiPolygonField(blank=True, null=True)
    area = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'boundary'


class Parcels(models.Model):
    geom = models.MultiPolygonField(blank=True, null=True)
    objectid = models.BigIntegerField(blank=True, null=True)
    shape_leng = models.FloatField(blank=True, null=True)
    shape_area = models.FloatField(blank=True, null=True)
    zone = models.CharField(max_length=254, blank=True, null=True)
    name = models.CharField(max_length=254, blank=True, null=True)
    proposals = models.CharField(max_length=254, blank=True, null=True)
    area = models.CharField(max_length=254, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'parcels'

class Rivers(models.Model):
    geom = models.MultiLineStringField(blank=True, null=True)
    objectid = models.BigIntegerField(blank=True, null=True)
    shape_leng = models.FloatField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'rivers'

class Roads(models.Model):
    geom = models.MultiLineStringField(blank=True, null=True)
    name = models.CharField(max_length=50, blank=True, null=True)
    cat = models.CharField(max_length=50, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'roads'

class Comment(models.Model):
    name = models.CharField("Name", max_length=50)
    description = models.TextField("Description")
    commented_on = models.DateTimeField("Comment On", auto_now=True)
    
    class Meta:
        verbose_name = "Comment"
        verbose_name_plural = "Comments"
        ordering = ('-commented_on', )

    def __str__(self):
        return self.name

    # def get_absolute_url(self):
    #     return reverse("Comment_detail", kwargs={"pk": self.pk})
