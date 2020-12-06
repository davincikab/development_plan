from django.contrib.gis.db import models


class Boundary(models.Model):
    geom = models.MultiLineStringField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'boundary'


class Parcels(models.Model):
    geom = models.MultiPolygonField(blank=True, null=True)
    name = models.CharField(max_length=50, blank=True, null=True)
    zone = models.CharField(max_length=254, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'parcels'


class Rivers(models.Model):
    geom = models.MultiLineStringField(blank=True, null=True)

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
