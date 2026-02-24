[中文](/CONTRIBUTING.md) | EN

# Contribution Guidelines

Thank you for your interest and support in the Countdown Calendar Tool project! We warmly welcome contributions from the community, whether it's fixing bugs, adding new features, or improving documentation.

## 📝 Contribution Workflow

### 1. Environment Setup

1.  **Fork the Repository**
    - Visit the [project repository](<Repository URL>)
    - Click the "Fork" button in the top right corner to create your own copy

2.  **Clone the Repository**
    ```bash
    git clone <Your fork URL>
    cd Countdown-Calendar
    ```

3.  **Create a Branch**
    - Create a new branch for your changes
    ```bash
    git checkout -b feature/feature-name
    # or
    git checkout -b fix/issue-description
    ```

---

### 2. Code Standards

Please follow the following code standards to ensure consistent code style across the project:

- **HTML**
  - Use semantic tags
  - Use 2 spaces for indentation
  - Use double quotes for attribute values

- **CSS**
  - Use lowercase letters with hyphens for selectors
  - Add a space after the colon in property names
  - Add a semicolon at the end of each rule
  - Use CSS variables to manage colors and dimensions

- **JavaScript**
  - Use camelCase naming convention
  - Use 2 spaces for indentation
  - Add a semicolon at the end of statements
  - Use ES6+ syntax
  - Avoid global variables; encapsulate modules with IIFEs
  - Add necessary comments to explain complex logic

---

### 3. Development and Testing

1.  **Local Testing**
    - Open `index.html` in your browser to test your changes
    - Ensure all features work correctly with no console errors
    - Test responsive layout to ensure proper display on different devices

2.  **Functionality Testing**
    - Test core features: add/edit/delete countdowns
    - Test theme switching functionality
    - Test count-up and countdown modes
    - Test time unit customization functionality

---

### 4. Submit Code

1.  **Review Changes**
    - Ensure only necessary files are modified
    - Check for any uncommitted temporary files

2.  **Commit Changes**
    - Write clear commit messages
    ```bash
    git add .
    git commit -m "feat: add description of new feature"  # New feature
    # or
    git commit -m "fix: fix description of issue"        # Bug fix
    # or
    git commit -m "docs: update description of document" # Documentation update
    ```

3.  **Push to Remote**
    ```bash
    git push origin feature/feature-name
    ```

---

### 5. Create Pull Request

1.  **Open Pull Request**
    - Visit your forked repository
    - Click the "Pull requests" tab
    - Click the "New pull request" button

2.  **Fill in Information**
    - Select the correct branch
    - Fill in the title to describe your changes concisely
    - Provide detailed information in the description:
      - What you modified
      - Why you made the modification
      - How to test your changes
      - Related Issues (if any)

3.  **Submit Pull Request**
    - Click the "Create pull request" button
    - Wait for maintainers to review

---

## 🐛 Report Issues

If you find a bug or have a feature suggestion, please report it following these steps:

1.  **Search Existing Issues**
    - First check the [Issues list](<Repository URL>/issues) to see if the issue has already been reported

2.  **Create a New Issue**
    - Click the "New issue" button
    - Select the appropriate template (Bug report or Feature request)
    - Fill in detailed information:
      - Issue description
      - Reproduction steps
      - Expected behavior
      - Actual behavior
      - Browser information
      - Screenshots (if any)

---

## 📞 Contact Us

If you have any questions, you can contact us through the following channels:

- **GitHub Issues**: Create an Issue in the repository
- **Email**: <Developer Email> (if provided)

---

## 🌟 Code of Conduct

Please respect other contributors and maintain friendly and professional communication. We are committed to building an inclusive and diverse community environment.

---

Thank you for your contributions—let's make this project better together!
