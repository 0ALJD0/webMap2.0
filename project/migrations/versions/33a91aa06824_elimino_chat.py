"""elimino chat

Revision ID: 33a91aa06824
Revises: 2a5292797b26
Create Date: 2025-01-10 16:36:40.879472

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '33a91aa06824'
down_revision = '2a5292797b26'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('chats')
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('chats',
    sa.Column('id', sa.INTEGER(), autoincrement=True, nullable=False),
    sa.Column('mensaje', sa.VARCHAR(length=500), autoincrement=False, nullable=False),
    sa.Column('fechayhora', postgresql.TIMESTAMP(), autoincrement=False, nullable=False),
    sa.PrimaryKeyConstraint('id', name='chats_pkey')
    )
    # ### end Alembic commands ###
