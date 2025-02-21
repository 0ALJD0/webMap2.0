"""Add Tipo Cocina y Servicio

Revision ID: ab2bdc7a7d47
Revises: a8cdb3168a3e
Create Date: 2024-12-10 17:46:44.925015

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'ab2bdc7a7d47'
down_revision = 'a8cdb3168a3e'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('tipo_cocinas',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('establecimiento_id', sa.Integer(), nullable=False),
    sa.Column('nombre', sa.String(length=100), nullable=False),
    sa.ForeignKeyConstraint(['establecimiento_id'], ['establecimientos.id'], ),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('nombre')
    )
    op.create_table('tipo_servicios',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('establecimiento_id', sa.Integer(), nullable=False),
    sa.Column('nombre', sa.String(length=100), nullable=False),
    sa.ForeignKeyConstraint(['establecimiento_id'], ['establecimientos.id'], ),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('nombre')
    )
    op.drop_column('establecimientos', 'tipo_cocina')
    op.drop_column('establecimientos', 'tipo_servicio')
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('establecimientos', sa.Column('tipo_servicio', sa.VARCHAR(length=100), autoincrement=False, nullable=True))
    op.add_column('establecimientos', sa.Column('tipo_cocina', sa.VARCHAR(length=100), autoincrement=False, nullable=True))
    op.drop_table('tipo_servicios')
    op.drop_table('tipo_cocinas')
    # ### end Alembic commands ###
