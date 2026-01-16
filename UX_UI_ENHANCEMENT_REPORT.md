# Prop Firm PNL Tracker - UX/UI Enhancement Report

**Date:** January 2026  
**Target Market:** Prop traders who trade with multiple prop firms and need to track overall P&L across all accounts, payouts, and fees  
**Report URL:** http://localhost:3000/report/a57be29c-c726-4d2d-85c9-64561b7d8a13

**Important:** This analysis treats the dashboard as a **report/document** rather than an application. The recommendations focus on creating a scannable, exportable financial report that can be read, printed, and shared - similar to a PDF financial statement or executive dashboard.

---

## Executive Summary

After a comprehensive review of the Prop Firm PNL Tracker **reporting dashboard**, I've identified opportunities to transform this from a feature-dense interface into a **clear, scannable financial report** that prop traders can quickly understand and share. The current implementation treats it like an application with complex navigation, when it should function more like a **PDF report or executive dashboard** - something you can read, understand, and export.

**Key Findings:**
- ✅ Comprehensive data and visualizations present
- ⚠️ **Report mindset missing** - Too many tabs/navigation instead of a flowing document
- ⚠️ Weak visual hierarchy - Key insights don't jump out
- ⚠️ Information density - Hard to scan quickly like a report
- ⚠️ Export/sharing not prominent enough for a report
- ⚠️ Missing executive summary/insights at-a-glance

---

## 1. Report Structure & Flow

### Current State
- 8 navigation tabs treating it like an application
- Users must click through tabs to see different sections
- No sense of a complete, flowing report document
- Can't easily scroll through all information
- **Transactions tab is critical** - users must manually assign transactions for report to be complete

### Recommendations

#### 1.1 Hybrid Approach: Report View + Transactions Workflow
**Priority: High**

**Problem:** Need both a readable report AND an interactive workflow for transaction assignment.

**Solution:**
- **Report View:** Single scrollable document with sections (read-only, like a PDF)
- **Transactions Tab:** Separate interactive view for manual assignment/workflow
- **Toggle between views:** "View Report" vs "Review Transactions"
- **Status indicator:** Show if transactions need review (badge/alert)

**Structure:**
```
┌─────────────────────────────────────┐
│ [View Report] [Review Transactions] │ ← Toggle buttons
├─────────────────────────────────────┤
│ ⚠️ 17 transactions need assignment   │ ← Alert if incomplete
├─────────────────────────────────────┤
│                                     │
│ REPORT VIEW (Scrollable):           │
│ ┌─────────────────────────────────┐ │
│ │ Executive Summary               │ │
│ ├─────────────────────────────────┤ │
│ │ Key Metrics                     │ │
│ ├─────────────────────────────────┤ │
│ │ Monthly Breakdown               │ │
│ ├─────────────────────────────────┤ │
│ │ Firm Performance                │ │
│ └─────────────────────────────────┘ │
│                                     │
│ TRANSACTIONS VIEW (Interactive):    │
│ ┌─────────────────────────────────┐ │
│ │ Transaction Assignment          │ │
│ │ - Unmatched transactions        │ │
│ │ - Manual assignment interface   │ │
│ │ - Bulk actions                  │ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

**Implementation:**
- Default to Report View (scrollable sections)
- Transactions button/tab is prominent and always accessible
- Badge on Transactions button showing count of unmatched
- After assigning transactions, show updated report

#### 1.2 Two-Mode Interface
**Priority: High**

**Mode 1: Report View** (Default)
- Single scrollable page
- All sections visible
- Read-only, exportable
- Like viewing a PDF

**Mode 2: Transactions Mode**
- Interactive assignment interface
- Focus on workflow: review, assign, accept
- Clear call-to-action to complete assignments
- Link back to view updated report

#### 1.3 Status Awareness
**Priority: High**

**Problem:** Users need to know if report is incomplete.

**Solution:**
- **Banner alert** at top if transactions need assignment
- **Badge on Transactions button** showing count
- **Completion indicator:** "Report 90% complete - Review 17 transactions"
- **Locked export?** (Optional) Don't allow export until critical transactions assigned, OR export with watermark "Preliminary - Pending Review"

#### 1.4 Quick Access to Transactions
**Priority: High**

Even in Report View, make Transactions easily accessible:
- **Sticky button:** "Review Transactions (17)" always visible
- **In-context links:** Link from "Match Rate: 10%" to transactions
- **Section in report:** "Transaction Review" section that links to full view

---

## 2. Report Header & Executive Summary

### Current State
- No clear report header or title
- Metrics are equal weight
- Missing executive summary that reports typically have
- No "report generated" metadata prominently displayed

### Recommendations

#### 2.1 Create Report Header Section
**Priority: High**

**Problem:** Doesn't feel like a report - missing title, date, scope.

**Solution:**
- **Report title** at top: "Prop Firm PNL Report"
- **Report metadata:** Date range, generation date, account(s) included
- **Report period:** Clear indication of what time period this covers
- **Share/Export** buttons prominently placed

**Visual Example:**
```
┌─────────────────────────────────────────┐
│  PROP FIRM PNL REPORT                  │
│  ─────────────────────────────────────  │
│  Period: Dec 16, 2025 - Jan 15, 2026   │
│  Generated: Jan 15, 2026 at 2:34 PM    │
│  Account: Chase Checking (****1234)     │
│                                          │
│  [Export PDF] [Share Link] [Print]     │
└─────────────────────────────────────────┘
```

#### 2.2 Create Executive Summary Section
**Priority: High**

**Problem:** Reports need an executive summary - key findings at a glance.

**Solution:**
- **Hero metric:** Large Net PNL display (like a report cover page)
- **Key insights:** 3-5 bullet points summarizing findings
- **Quick stats:** Top performing firm, biggest expense, etc.
- **Visual treatment:** Distinct section, maybe colored background

**Example:**
```
┌─────────────────────────────────────────┐
│  EXECUTIVE SUMMARY                      │
│  ─────────────────────────────────────  │
│                                          │
│  Net PNL: -$212.97                      │
│  Period: January 2026                   │
│                                          │
│  Key Findings:                          │
│  • Down $212.97 this month              │
│  • Topstep is top performer ($2,507)   │
│  • 10% match rate (294 of 2,934 txns)   │
│  • 7 prop firms tracked                 │
│                                          │
└─────────────────────────────────────────┘
```

#### 2.2 Reorganize Metric Cards
**Priority: High**

**Current:** 4 equal cards in a row
**Recommended:** 
- **Primary Metrics (2 cards, larger):** Net PNL, Total Deposits
- **Secondary Metrics (2 cards, smaller):** Total Fees, Match Rate
- Use size, color, and position to indicate importance

#### 2.3 Improve Chart Hierarchy
**Priority: Medium**

- Make the most important chart (Monthly PNL) larger and more prominent
- Use progressive disclosure - show summary charts first, detailed on click
- Add chart titles that explain what the user is looking at
- Include "Why this matters" tooltips

---

## 3. Key Metrics Section

### Current State
- 4 metric cards in a row
- Equal visual weight
- Hard to scan quickly

### Recommendations

#### 3.1 Report-Style Metric Cards
**Priority: High**

**Problem:** In a report, metrics should be scannable and hierarchical.

**Solution:**
- **Primary metrics (2-3):** Larger, more prominent
- **Secondary metrics:** Smaller, supporting
- **Layout:** Like a financial statement - organized and clear
- **Visual hierarchy:** Size, color, position indicate importance

**Report-style layout:**
```
┌─────────────────────────────────────────┐
│  KEY METRICS                             │
│  ─────────────────────────────────────  │
│                                          │
│  ┌──────────┐  ┌──────────┐            │
│  │ Net PNL  │  │ Deposits │            │
│  │ -$212.97 │  │ $2,297   │            │
│  └──────────┘  └──────────┘            │
│                                          │
│  ┌──────────┐  ┌──────────┐            │
│  │   Fees   │  │  Match   │            │
│  │ $2,510   │  │   10%    │            │
│  └──────────┘  └──────────┘            │
│                                          │
└─────────────────────────────────────────┘
```

#### 3.2 Improve Chart Readability
**Priority: High**

**Issues:**
- Chart axes labels are small
- Colors could be more distinct
- Missing data labels on key points

**Solutions:**
- Increase font sizes (minimum 14px for axis labels)
- Use higher contrast colors (WCAG AA compliant)
- Add data labels on hover/click
- Include value annotations on significant data points
- Add grid lines for easier reading

#### 3.3 Add Contextual Insights
**Priority: Medium**

Instead of just showing data, add insights:
- "Your PNL improved 15% this month"
- "Topstep accounts for 85% of your profits"
- "Consider reviewing unmatched transactions"

#### 3.4 Progressive Disclosure for Charts
**Priority: Medium**

- Show simplified view by default
- Allow expansion to detailed view
- Add "Show more" / "Show less" controls

---

## 4. Transactions - Critical Workflow Interface

### Current State
- Good filtering options (Payouts, Purchases, Needs Assignment, Add Missing)
- Table is functional but could be more user-friendly
- Long transaction descriptions are hard to read
- **Critical:** Users must assign unmatched transactions for report to be accurate

### Key Requirements
- **This is a workflow, not just a view** - Users need to take action
- **Report completeness depends on this** - Can't have accurate report without it
- **Needs to be prominent and accessible** - Not buried in report
- **Should feel separate from read-only report sections**

### Recommendations

#### 4.1 Report-Style Transaction Table
**Priority: High**

**Current Issues:**
- Long descriptions wrap awkwardly
- Hard to scan quickly
- Doesn't read like a report table

**Solutions:**
- **Truncate descriptions** with "Show more" expand
- **Add transaction icons** (💰 for payout, 💳 for purchase)
- **Group by date** (like a statement: January 2026, December 2025)
- **Report table styling** - Clean, readable, print-friendly
- **Summary rows** - Totals at bottom of each section
- **Page breaks** - Logical breaks for printing

#### 4.2 Transactions as Interactive Workflow (Not Just View)
**Priority: High**

**Current:** Transactions tab exists but may not emphasize the workflow
**Recommended:** 
- **Dual purpose:**
  - **Assignment Interface:** Focus on unmatched transactions needing review
  - **Transaction List:** Complete list for reference
- **Workflow emphasis:**
  - Start with "Needs Assignment" section (most important)
  - Clear instructions: "Review and assign these transactions to complete your report"
  - Bulk assignment tools
  - Progress indicator: "17 of 294 transactions need assignment"
- **Reference section:**
  - All transactions (for export/review)
  - Grouped by type: Payouts, Purchases, Unmatched
  - Searchable/filterable

#### 4.3 Transaction Assignment Interface Design
**Priority: High**

**Key Features:**
- **Prioritized view:** Unmatched transactions first (not buried)
- **Quick assign:** Dropdown or search to assign firm
- **Bulk select:** Select multiple, assign all at once
- **Suggestions:** Auto-suggest firms based on patterns
- **Confirmation:** "Assign 5 transactions to Topstep?" with preview
- **Undo/Redo:** Easy to correct mistakes

**UI Design:**
```
┌─────────────────────────────────────────┐
│  TRANSACTION REVIEW & ASSIGNMENT        │
│  ─────────────────────────────────────  │
│                                          │
│  Status: 17 transactions need review    │
│  Progress: 277 of 294 assigned (94%)   │
│                                          │
│  [Show: All | Unmatched | Assigned]     │
│                                          │
│  ┌─────────────────────────────────────┐│
│  │ ⚠️ UNMATCHED TRANSACTIONS (17)      ││
│  ├─────────────────────────────────────┤│
│  │ [Select All] [Assign Selected]      ││
│  ├─────────────────────────────────────┤│
│  │ ☐ Jan 12  $500.00  [Assign ↓]      ││
│  │    Description: Transfer from...    ││
│  │    Suggested: Topstep (85% match)  ││
│  ├─────────────────────────────────────┤│
│  │ ☐ Jan 8   $300.00  [Assign ↓]      ││
│  │    ...                               ││
│  └─────────────────────────────────────┘│
│                                          │
│  ┌─────────────────────────────────────┐│
│  │ ✓ ASSIGNED TRANSACTIONS (277)       ││
│  │ [Collapsed by default]              ││
│  └─────────────────────────────────────┘│
│                                          │
│  [Save & Update Report] [Cancel]        │
└─────────────────────────────────────────┘
```

#### 4.4 Integration with Report View
**Priority: High**

**Problem:** Users need to switch between viewing report and assigning transactions.

**Solution:**
- **Banner in Report View:** "⚠️ Report incomplete - 17 transactions need assignment [Review Now]"
- **Link from metrics:** Click on "Match Rate: 94%" → Go to Transactions
- **After assignment:** Auto-refresh report or show "Report updated" notification
- **Save state:** Remember where user was in report when they return

#### 4.3 Improve "Needs Assignment" UX
**Priority: High**

**Current:** Button shows "Needs Assignment17" (unclear)
**Recommended:**
- Better label: "17 Unmatched Transactions"
- Show count badge
- When clicked, show:
  - List of unmatched transactions
  - Quick assignment interface
  - Bulk assignment options
  - Suggested matches based on patterns

#### 4.4 Add Bulk Actions
**Priority: Medium**

- Select multiple transactions
- Bulk assign to firm
- Bulk export
- Bulk delete (with confirmation)

#### 4.5 Transaction Detail View
**Priority: Medium**

- Click transaction to see full details in modal/sidebar
- Show: Full description, raw data, confidence score explanation, edit history

---

## 5. Firms Tab

### Current State
- Good table layout
- Shows key metrics per firm
- Filter functionality works

### Recommendations

#### 5.1 Add Firm Comparison View
**Priority: High**

**Current:** Only table view
**Recommended:**
- Toggle between table and card view
- Card view shows:
  - Firm logo/icon
  - Key metrics in large text
  - Mini chart showing trend
  - Quick actions (View transactions, Export)

#### 5.2 Improve Firm Performance Visualization
**Priority: Medium**

- Add sparklines (mini trend charts) for each firm
- Color-code by performance (green for positive, red for negative)
- Add percentage change indicators

#### 5.3 Add Firm Details Modal
**Priority: Medium**

Click firm name to see:
- Detailed breakdown
- Transaction history
- Performance over time
- Comparison with other firms

---

## 6. Filters & Controls

### Current State
- Date range picker
- Quick date buttons (YTD, 30D, 90D, All)
- Firm filter dropdown
- Export dropdown

### Recommendations

#### 6.1 Improve Filter Visibility
**Priority: High**

**Current:** Filters are present but not prominent
**Recommended:**
- Add "Active Filters" indicator showing what's applied
- Make filters collapsible/expandable
- Add "Clear All Filters" button
- Show filter count badge

#### 6.2 Enhanced Date Range Picker
**Priority: Medium**

- Add preset ranges: "Last 7 days", "This Month", "Last Month", "This Quarter"
- Show calendar view option
- Add relative date options: "Since last payout", "Since account opened"

#### 6.3 Advanced Filtering
**Priority: Medium**

Add filter panel with:
- Amount range slider
- Transaction type (Payout, Purchase, Both)
- Confidence level
- Firm (multi-select)
- Date range
- Save filter presets

#### 6.4 Filter Persistence
**Priority: Low**

- Remember user's filter preferences
- Shareable filter URLs
- Save custom filter sets

---

## 7. Mobile & Print Views

### Current State
- Report may not be optimized for mobile viewing
- Print/PDF export may not match screen view
- Tables and charts may break on small screens

### Recommendations

#### 7.1 Mobile Report View
**Priority: High**

- **Vertical scrolling** - Single column, sections stack
- **Readable text** - Minimum 16px font size
- **Simplified charts** - Fewer data points, larger labels
- **Touch-friendly** - Larger tap targets for interactive elements
- **Section navigation** - Sticky table of contents

#### 7.2 Print-Optimized Layout
**Priority: High**

- **Print stylesheet** - Separate CSS for printing
- **Page breaks** - Logical section breaks
- **Headers/footers** - Report title, page numbers, date on each page
- **Remove interactive elements** - Charts become static images
- **Black & white friendly** - Ensure readability without color

#### 7.3 PDF Export Matching Screen
**Priority: High**

- **WYSIWYG export** - PDF looks exactly like screen
- **Multi-page handling** - Proper page breaks
- **Charts as images** - High-resolution chart exports
- **Preserve formatting** - Colors, spacing, layout maintained

---

## 8. Report Charts & Visualizations

### Current State
- Multiple chart types (Area, Bar, Line)
- Charts work but may not be report-ready
- Need to work in print/PDF export

### Recommendations

#### 8.1 Report-Style Charts
**Priority: High**

- **Clear titles** - Each chart needs a descriptive title
- **Axis labels** - Clear, readable labels (not too small)
- **Legends** - Positioned clearly, not overlapping
- **Data labels** - Key data points labeled on charts
- **Print-friendly** - High contrast, works in B&W

#### 8.2 Chart Context & Insights
**Priority: Medium**

- **Chart descriptions** - Brief text explaining what the chart shows
- **Key takeaways** - Bullet points highlighting insights
- **Annotations** - Mark significant events or milestones
- **Trend indicators** - Arrows, callouts for trends

#### 8.3 Chart Export Quality
**Priority: High**

- **High-resolution** - Charts export clearly in PDF
- **Vector or high-DPI** - Crisp in print
- **Standalone images** - Can be extracted and used separately
- **Alt text** - For accessibility and when images don't load

#### 8.4 Chart Placement in Report
**Priority: Medium**

- **Logical flow** - Charts appear near related data
- **Size hierarchy** - Most important charts larger
- **Page breaks** - Charts don't split awkwardly across pages
- **References** - Text references charts ("See Figure 1")

---

## 9. Report Readability & Context

### Current State
- No explanations of what metrics mean
- Missing context for calculations
- No legend or methodology section

### Recommendations

#### 9.1 Add Report Methodology Section
**Priority: Medium**

Reports should explain how data is calculated:
- **Footer or appendix:** "How this report is calculated"
- **Tooltips:** Hover over metrics to see calculation method
- **Legend:** Explain chart elements
- **Data sources:** Show which accounts/data sources were used

#### 9.2 Add Contextual Notes
**Priority: Medium**

- **Footnotes:** Explain unusual items or assumptions
- **Disclaimers:** Data accuracy, matching confidence
- **Notes section:** User can add notes to the report
- **Highlights:** Call out important findings

#### 9.3 Improve Metric Labels
**Priority: High**

Make labels report-ready:
- "PNL (Filtered)" → "Net Profit/Loss"
- Add units and time periods clearly
- Include "as of" dates
- Show calculation method (tooltip)

---

## 10. Export & Sharing (Critical for Reports)

### Current State
- Export button exists but not prominent
- Limited export options
- No print-optimized view
- Sharing not emphasized

### Recommendations

#### 10.1 Make Export Primary Action
**Priority: High**

**Problem:** For a report, export should be a primary action, not hidden in a dropdown.

**Solution:**
- **Prominent export buttons** in header: PDF, CSV, Print
- **Export preview** before downloading
- **Customizable exports:** Choose sections to include
- **Email report** option

#### 10.2 Print-Optimized View
**Priority: High**

- **Print stylesheet:** Optimize for printing
- **Page breaks:** Logical section breaks
- **Remove interactive elements:** Charts become static images
- **Header/footer:** Report title, page numbers, date on each page

#### 10.3 Shareable Report Links
**Priority: Medium**

- **Public share link:** Generate shareable URL
- **Password protection:** Optional password for shared reports
- **Expiration:** Set link expiration
- **View tracking:** See who viewed shared report

#### 10.4 Report Snapshots
**Priority: Low**

- **Save report versions:** Keep historical snapshots
- **Compare reports:** Compare different time periods
- **Report archive:** Access past reports

#### 10.3 Performance Optimization
**Priority: Medium**

- Lazy load charts and heavy components
- Virtualize long lists
- Debounce search/filter inputs
- Cache frequently accessed data

---

## 11. Accessibility

### Current State
- Basic accessibility likely present but needs verification

### Recommendations

#### 11.1 Keyboard Navigation
**Priority: High**

- Ensure all interactive elements are keyboard accessible
- Add keyboard shortcuts for common actions
- Visible focus indicators
- Logical tab order

#### 11.2 Screen Reader Support
**Priority: High**

- Proper ARIA labels
- Alt text for charts (describe data, not just "chart")
- Semantic HTML
- Skip links

#### 11.3 Color Contrast
**Priority: High**

- Ensure all text meets WCAG AA standards (4.5:1)
- Don't rely solely on color to convey information
- Add patterns/textures to charts for colorblind users

#### 11.4 Responsive Text
**Priority: Medium**

- Allow text scaling up to 200%
- Ensure layout doesn't break with larger text
- Provide text size controls

---

## 12. Polish & Micro-interactions

### Current State
- Functional but lacks polish
- Missing delightful micro-interactions

### Recommendations

#### 12.1 Add Micro-interactions
**Priority: Medium**

- **Button hover states:** Subtle scale/glow
- **Success feedback:** Confetti or checkmark animation
- **Loading animations:** Smooth, branded spinners
- **Transitions:** Smooth page/tab transitions
- **Hover previews:** Show data preview on hover

#### 12.2 Improve Visual Feedback
**Priority: Medium**

- Clear success/error states
- Progress indicators for multi-step processes
- Toast notifications for actions
- Confirmation dialogs for destructive actions

#### 12.3 Consistent Spacing & Typography
**Priority: Medium**

- Use consistent spacing scale (4px, 8px, 16px, etc.)
- Establish typography hierarchy
- Consistent border radius
- Consistent shadows/elevation

#### 12.4 Brand Consistency
**Priority: Low**

- Ensure color palette is consistent
- Use brand colors strategically (not everywhere)
- Consistent icon style
- Consistent illustration style (if using)

---

## 13. Specific UI Component Improvements

### 13.1 Export Functionality
**Priority: High**

**Current:** Dropdown with CSV/PDF options
**Recommended:**
- More prominent export button
- Show export options in modal
- Preview before export
- Customize export format (columns, date range, etc.)
- Export progress indicator
- "Export ready" notification

### 13.2 Compare Feature
**Priority: Medium**

**Current:** Button exists but unclear what it does
**Recommended:**
- Clear explanation of compare feature
- Compare modal/sidebar
- Select multiple firms/periods to compare
- Side-by-side comparison view
- Export comparison

### 13.3 Settings/Preferences
**Priority: Medium**

Add user preferences:
- Default date range
- Default tab
- Chart preferences
- Notification settings
- Export defaults

### 13.4 Share Functionality
**Priority: Low**

- Share report link
- Generate shareable summary
- PDF export for sharing
- Password-protected shares

---

## 14. Content & Copy

### Current State
- Functional labels but could be more user-friendly
- Some technical jargon

### Recommendations

#### 14.1 Improve Labels & Copy
**Priority: Medium**

**Current → Recommended:**
- "PNL (Filtered)" → "Net Profit/Loss"
- "Match Rate" → "Transaction Match Rate" (with tooltip explaining what it means)
- "Needs Assignment17" → "17 Transactions Need Review"
- "Add Missing" → "Add Manual Transaction"

#### 14.2 Add Contextual Explanations
**Priority: Medium**

- Explain what each metric means
- Show how calculations work (with "Learn more" link)
- Add examples
- Show what "good" vs "bad" looks like

#### 14.3 Improve Error Messages
**Priority: Medium**

- User-friendly language
- Actionable next steps
- Support contact information

---

## 15. Priority Implementation Roadmap

### Phase 1: Transform to Report Format (Week 1-2)
1. ✅ Create hybrid view: Report View + Transactions Mode toggle
2. ✅ Add report header with metadata
3. ✅ Create executive summary section
4. ✅ Add status indicator for incomplete transactions
5. ✅ Build single-scroll report structure
6. ✅ Add section navigation (table of contents)
7. ✅ Improve Transactions workflow interface
8. ✅ Improve export/print functionality

### Phase 2: Report Readability (Week 3-4)
1. ✅ Improve visual hierarchy (hero metrics)
2. ✅ Add methodology/notes section
3. ✅ Optimize for print/PDF
4. ✅ Enhance chart readability
5. ✅ Add report footnotes/disclaimers

### Phase 3: Report Features (Week 5-6)
1. ✅ Shareable report links
2. ✅ Report snapshots/versions
3. ✅ Print optimization
4. ✅ Mobile report view
5. ✅ Report comparison feature

---

## 16. Quick Wins (Can Implement Immediately)

1. **Add status banner** - Alert if transactions need assignment (e.g., "⚠️ 17 transactions need review")
2. **Prominent Transactions button** - Always visible with badge count
3. **Add report header** - Title, date range, generation date at top
4. **Create executive summary** - Hero section with key findings
5. **Make export prominent** - Move export buttons to header, not dropdown
6. **Add section anchors** - Make sections linkable (#summary, #metrics, etc.)
7. **Improve metric hierarchy** - Make Net PNL 2-3x larger, others smaller
8. **Improve Transactions workflow** - Prioritize unmatched, add bulk actions
9. **Add print stylesheet** - Optimize for printing
10. **Add report metadata** - "Report generated on..." footer

---

## 17. Metrics to Track

After implementing improvements, track:
- **Time to value:** How long until user finds key information
- **Feature discovery:** Which features are used most
- **Task completion:** Can users complete key tasks?
- **User satisfaction:** NPS or satisfaction surveys
- **Error rates:** How often do users encounter issues?
- **Mobile usage:** Percentage of mobile vs. desktop users

---

## Conclusion

The Prop Firm PNL Tracker has comprehensive data and functionality, but it's currently structured as an **application** when it should function as a **report/dashboard**. The key transformation needed is:

1. **Hybrid structure** - Report View (read-only, scrollable) + Transactions Mode (interactive workflow)
2. **Status awareness** - Clear indicators when transactions need assignment to complete report
3. **Executive summary** - Key findings at the top, like a financial report
4. **Export-first mindset** - Make PDF/print/export primary actions
5. **Readability** - Optimize report view for reading and scanning
6. **Workflow focus** - Transactions interface optimized for assignment task
7. **Report metadata** - Headers, footers, dates, methodology

Think of it like a **PDF financial report** with a **review workflow**. Users should:
- **View the report** - Scroll through it like reading a document, export/share/print
- **Complete the report** - Review and assign unmatched transactions when needed
- **Understand at a glance** - See if report is complete and what needs attention

By reframing to this hybrid model, you'll create something that:
- Serves as a readable, shareable financial report
- Guides users to complete the report through transaction assignment
- Maintains the report-like feel while accommodating necessary interactivity

---

**Next Steps:**
1. Review this report with the team
2. Prioritize improvements based on user feedback and business goals
3. Create detailed design mockups for high-priority items
4. Implement improvements in phases
5. Test with real users and iterate
