"""Creo Valoracion Model

Revision ID: 8772c255eea9
Revises: 62c01ddcc52d
Create Date: 2025-02-02 16:12:57.218558

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '8772c255eea9'
down_revision = '62c01ddcc52d'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('valoraciones',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('puntuacion', sa.Integer(), nullable=False),
    sa.Column('establecimiento_id', sa.Integer(), nullable=False),
    sa.Column('nombre_anonimo', sa.String(length=100), nullable=True),
    sa.Column('comentario', sa.String(length=500), nullable=True),
    sa.Column('fecha', sa.DateTime(), nullable=True),
    sa.ForeignKeyConstraint(['establecimiento_id'], ['establecimientos.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('valoraciones')
    # ### end Alembic commands ###
