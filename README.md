# StudioForm - Custom Fork

A customized and enhanced version of StudioForm with improved validation, accessibility, and user experience features.

## 🎯 Overview

This is a forked version of StudioForm that includes several custom enhancements:
- ✅ Global URL validation with auto-fix
- ✅ Keyboard-accessible file upload buttons
- ✅ Global error display system for all field types
- ✅ RTF/WYSIWYG editor validation
- ✅ Anti-glitch cloaking system
- ✅ Enhanced file upload validation

## 📦 Installation

Simply include the custom `index.js` file in your project:

```html
<script src="path/to/studioform/index.js"></script>
```

No additional dependencies required (GSAP is auto-loaded if not present).

## 🚀 Features

### 1. URL Field Validation

**Automatically validates all URL inputs** with smart auto-correction.

#### Usage:
```html
<input type="url" id="website" name="website" placeholder="https://example.com">
```

#### Features:
- Auto-adds `https://` if protocol is missing
- Validates domain format and TLD
- Prevents navigation on Backspace key press
- Only validates when field has content (not required by default)
- Validation triggers on "Next" button click

#### Technical Details:
- **Location**: [index.js:117-135](index.js#L117)
- **Blocked navigation**: [index.js:1929](index.js#L1929) - URL type added to blocked input types
- **Validation logic**: Checks protocol, hostname, domain structure

---

### 2. Keyboard-Accessible Upload Buttons

**All file upload buttons are now fully keyboard accessible.**

#### Features:
- Tab to upload button
- Press **Enter** or **Space** to trigger file picker
- Visual focus indicator (blue outline)
- Automatically applies to all file inputs

#### Usage:
```html
<input type="file" id="logo" name="logo" class="btn_input_upload">
<label for="logo">Upload</label>
```

#### Technical Details:
- **Location**: [index.js:1947-1975](index.js#L1947)
- Adds `tabindex="0"` and `role="button"` to upload buttons
- Focus/blur event handlers for visual feedback
- MutationObserver watches for dynamically added file inputs

---

### 3. Global Error Display System

**Unified error handling for all field types** with animations and visual feedback.

#### Features:
- Red border with shake animation on invalid fields
- Error messages appear below fields
- Smooth scroll to first error
- Auto-clears previous errors
- Works with:
  - Text inputs
  - Email inputs
  - URL inputs
  - Number inputs
  - File uploads
  - Textareas
  - RTF/WYSIWYG editors

#### Visual Feedback:
- **Red border**: `2px solid #dc3545`
- **Shake animation**: 0.3s on validation fail
- **Fade-in animation**: Error messages slide in
- **Auto-scroll**: Smooth scroll to first error

#### Technical Details:
- **CSS Styles**: [index.js:1977-2005](index.js#L1977)
- **Event Listener**: [index.js:2012-2059](index.js#L2012)
- **Event Trigger**: [index.js:1444-1448](index.js#L1444)
- **Custom Event**: `sf-report-validity`

#### Error Messages:
| Field Type | Message |
|------------|---------|
| Empty field | "This field is required" |
| File input | "Please select a file" |
| File attachment | "Please upload a file" |
| Invalid URL | "Please enter a valid URL format" |
| Invalid email | "invalid email" |
| Invalid number | Custom range/increment messages |

---

### 4. RTF/WYSIWYG Editor Validation

**Validates rich text editors** linked to textareas.

#### Usage:
```html
<textarea id="description" required></textarea>
<div data-tiny-editor contenteditable="true"></div>
```

#### Features:
- Detects textareas with `[data-tiny-editor]` siblings
- Validates actual editor content (strips HTML)
- Shows error on editor element
- Red border highlights the visual editor
- Works with tiny-editor and similar WYSIWYG libraries

#### Technical Details:
- **Location**: [index.js:106-119](index.js#L106)
- Strips HTML tags to check for actual content
- Uses closest parent to find editor element
- Error displays on visual editor, not hidden textarea

---

### 5. Anti-Glitch Cloak System

**Prevents flash of all slides** during StudioForm initialization.

#### Usage:
```html
<div sf-cloak>
  <form sf="mask">
    <div>Slide 1</div>
    <div>Slide 2</div>
    <div>Slide 3</div>
  </form>
</div>
```

#### Supported Attributes:
- `sf-cloak`
- `studio-form-cloak`
- `data-sf-cloak`

#### How It Works:
1. **Pre-init CSS** ([index.js:2-23](index.js#L2)) hides all slides except first
2. Form wrapper is hidden with `visibility: hidden`
3. **On initialization** ([index.js:1719-1726](index.js#L1719)):
   - Adds `sf-initialized` class
   - Reveals form with `visibility: visible`
   - Removes cloak attribute after 50ms

#### Technical Details:
- Injected CSS before StudioForm loads
- Uses `:not(:first-child)` selector to hide slides
- Smooth transition on reveal
- No JavaScript delays required

---

### 6. Enhanced File Upload Validation

**Better validation and error messages** for file uploads.

#### Features:
- Checks for `sf-attached` attribute (custom file handlers)
- Validates `files` property in addition to value
- Different messages for attachment vs direct upload
- Highlights upload button, not hidden input

#### Technical Details:
- **Location**: [index.js:92-104](index.js#L92)
- Finds upload label via `for` attribute
- Passes label reference to error handler
- Error highlights the visible button

---

## 🔧 Configuration

### StudioForm Settings

No additional configuration needed! All features work with standard StudioForm setup.

Standard StudioForm attributes still work:
```html
<div sf-wrapper>
  <form sf="mask">
    <!-- Your slides -->
  </form>
</div>
```

### Custom Error Styling

Override default error styles by targeting these classes:

```css
/* Error indicator border */
.sf-error-indicator {
  border: 2px solid #your-color !important;
}

/* Error message text */
.sf-error-message {
  color: #your-color;
  font-size: 0.875em;
}

/* RTF editor errors */
[data-tiny-editor].sf-error-indicator {
  border-color: #your-color;
}
```

### Keyboard Focus Styling

Customize upload button focus indicator:

```javascript
// Modify focus styles in initFileUploadAccessibility()
uploadButton.addEventListener('focus', function() {
  this.style.outline = '3px solid #your-color';
  this.style.outlineOffset = '4px';
});
```

---

## 📝 Custom Events

### `sf-report-validity`

Fired when validation fails. Contains error details.

```javascript
document.addEventListener('sf-report-validity', function(e) {
  const errors = e.detail.validity;

  errors.forEach(error => {
    console.log('Input:', error.input);
    console.log('Message:', error.message);
    console.log('Label:', error.label); // For file inputs
    console.log('RTF Editor:', error.rtfEditor); // For WYSIWYG
  });
});
```

#### Event Detail Structure:
```javascript
{
  validity: [
    {
      input: HTMLInputElement,
      message: "error message",
      label: HTMLLabelElement,     // Only for file inputs
      rtfEditor: HTMLDivElement     // Only for RTF fields
    }
  ]
}
```

---

## 🎨 Animations

### Shake Animation
```css
@keyframes sf-shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}
```
Duration: 0.3s

### Fade-in Animation
```css
@keyframes sf-fade-in {
  from { opacity: 0; transform: translateY(-5px); }
  to { opacity: 1; transform: translateY(0); }
}
```
Duration: 0.2s

---

## 🐛 Troubleshooting

### Upload buttons not clickable

**Issue**: Upload buttons don't respond to click/keyboard.

**Solution**: Ensure your HTML structure is:
```html
<div class="button">
  <label for="file-input">Upload</label>
  <input type="file" id="file-input">
</div>
```

### URL validation not working

**Issue**: URL fields not being validated.

**Solution**: Use `type="url"` (not `data-type="url"`):
```html
<input type="url" name="website">
```

### Glitch on page load

**Issue**: All slides flash before hiding.

**Solution**: Add cloak attribute to wrapper:
```html
<div sf-cloak>
  <!-- form content -->
</div>
```

### RTF editor errors not showing

**Issue**: WYSIWYG editor validation not working.

**Solution**: Ensure structure is:
```html
<div class="form-field-wrapper">
  <textarea id="desc" required></textarea>
  <div data-tiny-editor contenteditable="true"></div>
</div>
```

### Errors not clearing

**Issue**: Old error messages remain visible.

**Solution**: Errors auto-clear on next validation. If persisting, check for duplicate error handlers.

---

## 📊 Browser Support

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

**Required Features**:
- CSS animations
- Custom events
- MutationObserver
- Proxy objects
- ES6+ syntax

---

## 🔍 Code Reference

### Key Functions

| Function | Location | Purpose |
|----------|----------|---------|
| `initFileUploadAccessibility()` | [index.js:1947](index.js#L1947) | Makes upload buttons keyboard accessible |
| `initGlobalErrorDisplay()` | [index.js:1977](index.js#L1977) | Sets up global error system |
| URL validation | [index.js:117-135](index.js#L117) | Validates URL fields |
| RTF validation | [index.js:106-119](index.js#L106) | Validates WYSIWYG editors |
| File validation | [index.js:92-104](index.js#L92) | Validates file uploads |
| Pre-init styles | [index.js:2-23](index.js#L2) | Anti-glitch CSS injection |

### Validation Flow

```
User clicks "Next"
    ↓
StudioForm collects all inputs
    ↓
Validation checks (lines 88-160)
    ↓
Errors found?
    ↓ YES
Custom event fired (line 1444)
    ↓
Global error handler (line 2012)
    ↓
Visual feedback displayed
    ↓
Scroll to first error
```

---

## 🚧 Customization

### Adding Custom Validation

Add custom validation after line 155 in `index.js`:

```javascript
// After URL validation block
if (t.type === 'custom-type') {
  // Your custom validation
  if (!customValidation(n)) {
    return void s.push({
      input: t,
      message: "Custom error message"
    });
  }
}
```

### Custom Error Display

Hook into the error event:

```javascript
document.addEventListener('sf-report-validity', function(e) {
  // Custom error display logic
  const errors = e.detail.validity;

  // Show custom modal, toast, etc.
  showCustomErrorModal(errors);
});
```

### Disable Features

Comment out the initialization:

```javascript
// Disable keyboard accessibility
// initFileUploadAccessibility();

// Disable global errors
// initGlobalErrorDisplay();
```

---

## 📚 Additional Resources

### StudioForm Documentation
- Original docs: [StudioForm Docs](https://studioform.com/docs)

### Related Technologies
- **GSAP**: Animation library (auto-loaded)
- **Tiny Editor**: WYSIWYG editor library
- **StudioForm**: Base form framework

---

## 🤝 Contributing

This is a private fork. For internal use only.

### Making Changes

1. Locate the relevant section in `index.js`
2. Make your changes
3. Test thoroughly with:
   - Keyboard navigation
   - Required fields
   - File uploads
   - RTF editors
4. Update this README

### Testing Checklist

- [ ] Tab through all inputs
- [ ] Press Enter/Space on upload buttons
- [ ] Test URL auto-fix (type "google.com")
- [ ] Test required fields (empty submit)
- [ ] Test RTF editor validation
- [ ] Test file upload errors
- [ ] Check animations work
- [ ] Verify no glitch on load

---

## 📋 Version History

### Current Version (Custom Fork)
- ✅ URL validation with auto-fix
- ✅ Keyboard-accessible uploads
- ✅ Global error system
- ✅ RTF editor validation
- ✅ Anti-glitch cloaking
- ✅ Enhanced file validation

### Base Version
- StudioForm v1.5.2

---

## 💡 Tips & Best Practices

### Performance

- MutationObserver only watches for file inputs (optimized)
- Error styles are injected once (no duplication)
- Event listeners use event delegation where possible

### Accessibility

- All interactive elements are keyboard accessible
- Focus indicators are clear and visible
- Error messages are announced by screen readers
- ARIA attributes auto-set by StudioForm

### User Experience

- Errors appear instantly on validation
- Smooth animations don't distract
- Auto-scroll brings errors into view
- Clear, actionable error messages

### Development

- Keep validation logic in one place (lines 88-160)
- Use custom events for extensibility
- Comment complex logic
- Test edge cases (empty, whitespace, special chars)

---

## 🔐 Security Notes

- URL validation prevents malicious protocols
- File upload validation checks MIME types
- No eval() or innerHTML from user input
- XSS protection via proper escaping

---

## 📞 Support

For issues or questions:
1. Check troubleshooting section above
2. Review code comments in `index.js`
3. Test in isolation (remove custom scripts)
4. Check browser console for errors

---

## 📄 License

Private fork for internal use. Based on StudioForm.

---

**Last Updated**: 2025-09-30
**Maintainer**: Future You 👋
**Version**: Custom Fork v1.0

---

## Quick Start Checklist

- [ ] Include `index.js` in your project
- [ ] Use `type="url"` for URL fields
- [ ] Add `sf-cloak` to form wrapper
- [ ] Mark required fields with `required` attribute
- [ ] Use `[data-tiny-editor]` for WYSIWYG editors
- [ ] Test keyboard navigation
- [ ] Test validation errors
- [ ] Enjoy enhanced StudioForm! 🎉