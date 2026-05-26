package com.substring.auth.app.auth.payload;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserStats {
    private int totalLogins;
    private int securityScore;
    private int activeSessions;
}
