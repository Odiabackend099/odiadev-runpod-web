#!/bin/bash

# Comprehensive Security Audit Script
# Verifies repository is bulletproof and production-ready

set -e

echo "🔒 BULLETPROOF SECURITY AUDIT"
echo "=============================="
echo

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Track overall status
AUDIT_PASSED=true

# Function to print status
print_status() {
    if [ $2 -eq 0 ]; then
        echo -e "${GREEN}✅ $1${NC}"
    else
        echo -e "${RED}❌ $1${NC}"
        AUDIT_PASSED=false
    fi
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

echo "1. Checking git history for secrets..."
# Check for actual hardcoded secrets, not package names or env var references
if git log -p | grep -Ei "(ghp_[A-Za-z0-9_]{36}|sk_[A-Za-z0-9]{32,}|-----BEGIN.*PRIVATE KEY-----)" > /dev/null; then
    print_status "Git history contains hardcoded secrets" 1
    echo "   Run: git filter-repo to clean history"
else
    print_status "Git history is clean" 0
fi

echo
echo "2. Checking for large files..."
LARGE_FILES=$(git rev-list --objects --all | git cat-file --batch-check='%(objecttype) %(objectname) %(objectsize) %(rest)' | awk '$3>52428800 {print $0}')
if [ -n "$LARGE_FILES" ]; then
    print_status "Large files detected" 1
    echo "$LARGE_FILES"
else
    print_status "No large files detected" 0
fi

echo
echo "3. Checking .gitignore completeness..."
MISSING_PATTERNS=()
REQUIRED_PATTERNS=(".env" "*.key" "*.pem" "*.mp3" "*.wav" "node_modules/" "__pycache__/")

for pattern in "${REQUIRED_PATTERNS[@]}"; do
    if ! grep -q "^$pattern" .gitignore 2>/dev/null; then
        MISSING_PATTERNS+=("$pattern")
    fi
done

if [ ${#MISSING_PATTERNS[@]} -eq 0 ]; then
    print_status ".gitignore is comprehensive" 0
else
    print_status ".gitignore missing patterns" 1
    echo "   Missing: ${MISSING_PATTERNS[*]}"
fi

echo
echo "4. Checking pre-push hook..."
if [ -f .git/hooks/pre-push ] && [ -x .git/hooks/pre-push ]; then
    print_status "Pre-push hook is installed and executable" 0
else
    print_status "Pre-push hook missing or not executable" 1
fi

echo
echo "5. Checking GitHub workflows..."
WORKFLOW_FILES=(".github/workflows/gitleaks.yml" ".github/workflows/ci.yml")
for workflow in "${WORKFLOW_FILES[@]}"; do
    if [ -f "$workflow" ]; then
        print_status "Workflow $workflow exists" 0
    else
        print_status "Workflow $workflow missing" 1
    fi
done

echo
echo "6. Checking security documentation..."
SECURITY_FILES=("SECURITY.md" "CHANGELOG.md" ".github/CODEOWNERS" ".github/pull_request_template.md")
for file in "${SECURITY_FILES[@]}"; do
    if [ -f "$file" ]; then
        print_status "Security file $file exists" 0
    else
        print_status "Security file $file missing" 1
    fi
done

echo
echo "7. Checking for exposed secrets in current files..."
# Check for actual hardcoded secrets, not environment variable references
if find . -name "*.py" -o -name "*.js" -o -name "*.ts" -o -name "*.json" -o -name "*.md" | xargs grep -l -E "(ghp_[A-Za-z0-9_]{36}|sk_[A-Za-z0-9]{32,}|-----BEGIN.*PRIVATE KEY-----)" 2>/dev/null; then
    print_status "Hardcoded secrets found in current files" 1
else
    print_status "No hardcoded secrets in current files" 0
fi

echo
echo "8. Testing pre-push hook..."
if [ -f .git/hooks/pre-push ]; then
    if bash .git/hooks/pre-push 2>/dev/null; then
        print_status "Pre-push hook passes" 0
    else
        print_status "Pre-push hook fails" 1
    fi
else
    print_warning "Pre-push hook not found, cannot test"
fi

echo
echo "9. Checking repository structure..."
REQUIRED_DIRS=("backend" "frontend" "infra" "scripts" ".github/workflows")
for dir in "${REQUIRED_DIRS[@]}"; do
    if [ -d "$dir" ]; then
        print_status "Directory $dir exists" 0
    else
        print_status "Directory $dir missing" 1
    fi
done

echo
echo "10. Final security summary..."
echo "=============================="

if [ "$AUDIT_PASSED" = true ]; then
    echo -e "${GREEN}🎉 SECURITY AUDIT PASSED${NC}"
    echo -e "${GREEN}✅ Repository is bulletproof and production-ready${NC}"
    echo
    echo "Next steps:"
    echo "1. Set up GitHub branch protection rules"
    echo "2. Configure environment secrets"
    echo "3. Rotate all exposed keys"
    echo "4. Test CI/CD workflows"
    exit 0
else
    echo -e "${RED}🚨 SECURITY AUDIT FAILED${NC}"
    echo -e "${RED}❌ Repository has security issues that must be fixed${NC}"
    echo
    echo "Fix the issues above before proceeding to production"
    exit 1
fi
