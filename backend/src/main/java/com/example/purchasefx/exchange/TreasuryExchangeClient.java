package com.example.purchasefx.exchange;

import com.example.purchasefx.exchange.dto.TreasuryApiResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.Collections;
import java.util.List;

@Component
public class TreasuryExchangeClient {

    private final RestClient restClient;
    private final String baseUrl;

    public TreasuryExchangeClient(
            @Value("${treasury.api.url:https://api.fiscaldata.treasury.gov/services/api/fiscal_service/v1/accounting/od/rates_of_exchange}") String baseUrl) {
        this.restClient = RestClient.builder().build();
        this.baseUrl = baseUrl;
    }

    public List<TreasuryApiResponse.TreasuryRateData> fetchRates(String country, String currency, String gteDate, String lteDate) {
        // Build the filter string. Note: Treasury API uses format field:operator:value
        StringBuilder filterBuilder = new StringBuilder();
        
        if (country != null) {
            filterBuilder.append("country:eq:").append(country).append(",");
        }
        if (currency != null) {
            filterBuilder.append("currency:eq:").append(currency).append(",");
        }
        if (gteDate != null) {
            filterBuilder.append("record_date:gte:").append(gteDate).append(",");
        }
        if (lteDate != null) {
            filterBuilder.append("record_date:lte:").append(lteDate).append(",");
        }

        String filter = filterBuilder.toString();
        if (filter.endsWith(",")) {
            filter = filter.substring(0, filter.length() - 1);
        }

        String uri = UriComponentsBuilder.fromUriString(baseUrl)
                .queryParam("filter", filter)
                .queryParam("sort", "-record_date") // Get latest first
                .queryParam("page[size]", "1000")
                .build()
                .toUriString();

        try {
            TreasuryApiResponse response = restClient.get()
                    .uri(uri)
                    .retrieve()
                    .body(TreasuryApiResponse.class);
            
            if (response != null && response.getData() != null) {
                return response.getData();
            }
            return Collections.emptyList();
        } catch (Exception e) {
            // Throw a specific exception that can be caught and translated to 503
            throw new RuntimeException("Failed to fetch exchange rates from Treasury API", e);
        }
    }

    public List<TreasuryApiResponse.TreasuryRateData> fetchLatestRates() {
        String uri = UriComponentsBuilder.fromUriString(baseUrl)
                .queryParam("sort", "-record_date")
                .queryParam("page[size]", "5000") // Enough to get the latest unique currencies
                .build()
                .toUriString();

        try {
            TreasuryApiResponse response = restClient.get()
                    .uri(uri)
                    .retrieve()
                    .body(TreasuryApiResponse.class);
            
            if (response != null && response.getData() != null) {
                return response.getData();
            }
            return Collections.emptyList();
        } catch (Exception e) {
            throw new RuntimeException("Failed to fetch exchange rates from Treasury API", e);
        }
    }
}
