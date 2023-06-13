package handlers

import (
	"testing"
)

func TestHashSHA256(t *testing.T) {
	tests := []struct {
		input       string
		expected    string
		expectError bool
	}{
		// 正常なケース
		{
			input:       "4",
			expected:    "4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a",
			expectError: false,
		},
		// 空文字列の場合
		{
			input:       "",
			expected:    "",
			expectError: true,
		},
		// 空白を含む場合
		{
			input:       "abc def",
			expected:    "",
			expectError: true,
		},
		// 数値以外の文字列の場合
		{
			input:       "abc123!",
			expected:    "",
			expectError: true,
		},
	}

	for _, test := range tests {
		result, err := hashSHA256(test.input)

		// エラーの期待値と実際の結果を比較
		if (err != nil) != test.expectError {
			t.Errorf("Input: %s, Expected error: %v, Got error: %v", test.input, test.expectError, err)
		}

		// ハッシュ化された結果の期待値と実際の結果を比較
		if result != test.expected {
			t.Errorf("Input: %s, Expected: %s, Got: %s", test.input, test.expected, result)
		}
	}

}
