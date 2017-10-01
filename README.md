# Compare

Compare features of different solutions from all sorts of branches.

## Contributing

### Introduction

#### Definitions

- A **Branch** is a collection of Solutions which have a shared goal, e.g. Communication.
- A **Solution** is anything which achieves the goal of the Branch.
- **Compare Point**s are different per branch and defined in the compare_points.json of the Branch folder. Some Compare Points don't apply to all Solutions in a Branch, so not all Compare Points are defined for all Solutions. For example: A messenger like WhatsApp might not need Hotkeys, whilst other Solutions in the Communication Branch need them.

#### `support`

Most Compare Points are *supportable* (e.g. they have the `support` value). The `support` value can be `-1`, `0` and `1`, meaning "no support", "partial support" and "full support", respectively.

It is highly recommended you always have the compare_points.json of your branch open, as it contans the `desc` values, which have "should"-statements in them.

- If the statement does not apply, the `support` value should be `-1`.
- If the statement partially applies, the `support` value should be  `0`.
- If the statement fully applies, the `support` value should be `1`.

#### `info`

If the statement only partially applies (and `support` is `0`) you might want to add an `info` value to clarify what exactly is wrong, but make sure not to have such a long sentence. Instead of writing "[Solution] tries to [feature] whenever possible." just try to write something shorter like "Whenever Possible."

Depending on the branch, there are things where `info` should always be used for a certain Compare Points, e.g. Desktop Version & Mobile Version. In order to not get anything wrong, look at other solutions in that branch.

If the `desc` value is not a "should"-statement it is just a general fact (such as Audio Cocec). In this case you do not set any `support` value, but an `info` value, and since it is a fact, at least one citation should be given.

#### Citations (`cites`)

If possible, there should be a citation for every Compare Point, but that is most likely not going to happen, but if you have one citation you just add the `cites` value with an array as follows:

	"cites": [
		"https://citation-one.dummy/"
	]

And it doesn't change much with multiple citations.

	"cites": [
		"https://citation-one.dummy/",
		"https://citation-two.dummy/"
	]

Just make sure to remove any artifacts like `en-GB` or `utm_source` from the URL and try to avoid extra commas (such as `,]` and `,}`), as that is invalid JSON and that [will automatically invalidate your pull request](https://github.com/timmyrs/Compare/pull/1).

### What is there to be added?

#### In the Communication Branch

If you have experience in either of these Communication Solutions, you may add them to Compare.

Solution                         | File Name      | Template
-------------------------------- | -------------- | -----------------------
Signal                           | signal.json    | messenger_template.json
Twitter DMs                      | twitter.json   | messenger_template.json
Google Allo                      | allo.json      | messenger_template.json

### Verification or Information needed

If you feel like contributing, but don't feel like filling out a big JSON file with citations, this is the right thing for you.

Just [look for needed verifications or informations](https://github.com/timmyrs/Compare/search?utf8=%E2%9C%93&q=%22Verification+needed.%22+OR+%22Information+needed.%22&type=) and fill in the one Comparison Point if you know the Solution.
