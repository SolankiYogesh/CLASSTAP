module.exports = function () {
  return `
  <!DOCTYPE html>
  <html xmlns="http://www.w3.org/1999/xhtml" class="perfect-scrollbar-on">
  <head>
  </head>
  <body>
  <!-- https://checkout.payfort.com/FortAPI/paymentPage -->
  <!-- https://sbcheckout.payfort.com/FortAPI/paymentPage -->
    <form action='https://sbcheckout.payfort.com/FortAPI/paymentPage' method='post' name='frm'>
        <input type='hidden' name='command' value='PURCHASE'>
        <input type='hidden' name='access_code' value='bEvwRWs7PeuCSy74jv0d'>
        <input type='hidden' name='merchant_identifier' value='3f86d746'>
        <input type='hidden' name='merchant_reference' value='1633507737923'> 
        <input type='hidden' name='amount' value='4300'>
        <input type='hidden' name='currency' value='QAR'>
        <input type='hidden' name='language' value='en'>
        <input type="hidden" name="customer_email" value="test@test.tt">
        <input type="hidden" name="customer_ip" value="192.178.1.10">
        <input type="hidden" name="token_name" value="acRtWzYHaXlAjppaekBIsbfhCqIDUhmVFDVabRVVgy">
        <input type='hidden' name='signature' value='dd69412560aedebc67eec45486fc1fff8e4619217535542a6a2d0d5a02afb7fa'>
        <!-- <button type="submit">submit</button> -->
        <script type='text/javascript'>
            console.log(document.frm)

            setTimeout(() => {
                document.frm.submit();
            }, 2000)

        </script>
    </form> 
    </body>
  
  
`
}
