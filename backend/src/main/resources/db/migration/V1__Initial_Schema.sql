CREATE TABLE purchase_transactions (
    id UUID PRIMARY KEY,
    nickname VARCHAR(40),
    description VARCHAR(50) NOT NULL,
    transaction_date DATE NOT NULL,
    purchase_amount_usd NUMERIC(19,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL,
    version BIGINT NOT NULL,
    CONSTRAINT check_purchase_amount_usd_positive CHECK (purchase_amount_usd > 0)
);

CREATE TABLE purchase_conversion_history (
    id UUID PRIMARY KEY,
    transaction_id UUID NOT NULL REFERENCES purchase_transactions(id),
    target_country VARCHAR(255) NOT NULL,
    target_currency VARCHAR(255) NOT NULL,
    exchange_rate NUMERIC(19,4) NOT NULL,
    exchange_rate_date DATE NOT NULL,
    converted_amount NUMERIC(19,2) NOT NULL,
    status VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL
);
