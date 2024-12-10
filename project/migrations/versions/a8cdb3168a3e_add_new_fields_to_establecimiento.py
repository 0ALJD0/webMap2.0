"""Add new fields to Establecimiento

Revision ID: a8cdb3168a3e
Revises: a06aa9cba9f8
Create Date: 2024-12-10 16:50:33.597429

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'a8cdb3168a3e'
down_revision = 'a06aa9cba9f8'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('establecimientos', sa.Column('tipo_servicio', sa.String(length=100), nullable=True))
    op.add_column('establecimientos', sa.Column('tipo_cocina', sa.String(length=100), nullable=True))
    op.add_column('establecimientos', sa.Column('numero_taza', sa.Integer(), nullable=True))
    op.add_column('establecimientos', sa.Column('numero_cubiertos', sa.Integer(), nullable=True))
    op.add_column('establecimientos', sa.Column('numero_copas', sa.Integer(), nullable=True))
    op.add_column('establecimientos', sa.Column('petfriendly', sa.Boolean(), nullable=True))
    op.add_column('establecimientos', sa.Column('accesibilidad', sa.Boolean(), nullable=True))
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('establecimientos', 'accesibilidad')
    op.drop_column('establecimientos', 'petfriendly')
    op.drop_column('establecimientos', 'numero_copas')
    op.drop_column('establecimientos', 'numero_cubiertos')
    op.drop_column('establecimientos', 'numero_taza')
    op.drop_column('establecimientos', 'tipo_cocina')
    op.drop_column('establecimientos', 'tipo_servicio')
    # ### end Alembic commands ###
