# Can Roca Checker

El Celler de Can Roca is one of the best restaurants of the world, but its only
impossible to get a reservation. They only book 11 months in advance, every 1st day
of the month a new month opens for reservations (11 months from now), and they get sold
out very fast.

So I created this little node script, using puppeteer to check for availability every month,
and send you an email if there is any.

## Email sending

To send the emails the script uses [Sparkpost](http://www.sparkpost.com), you can create an account for free.

You will also need these environmental variables for the email sending to work:

| Name | Description | Required |
| ---- | ----------- | -------- |
| EMAIL_FROM | Email to send from | Yes |
| EMAIL_TO | Email to send to | Yes |
| SPARKPOST_API_KEY | [API key](https://app.sparkpost.com/account/api-keys) to send emails using Sparkpost | Yes |


## Crontab

To run this script the last day of the month at 23:01pm (UK time, which is 00:01pm in Spain)
you can use the following crontab format. Modify the time depending on your timezone.

```
01 23 28-31 * * ['$(date +%d -d tomorrow)' == '01' ] && node /path/to/index.js
```
