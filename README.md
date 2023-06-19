## はじめに ##
このレポジトリに入っているスクリプトは、サンプルとなっています。ご利用される方は、環境に併せてカスタマイズしてご利用頂くことを想定しています。

---
**利用目的:**
Syntheticsにて、定期的にICMPポーリングを対象IPアドレス群に実施し、その結果をカスタムEventスペースに記録するための機能となっています。そのため、Synthetics上では対象モニターの実施結果がSUCCESSとなることを期待しており、モニター内部でのICMPポーリングの結果に寄らずに、適切にモニターの処理が稼働したということを表しています。また、各ICMPポーリングの結果については、カスタムEVENTスペースに格納しているので、NRQLやData explorerを活用して確認する必要があります。(別途、ダッシュボード化についての情報も追記予定)

pinger.js: 
このファイル内容をNew Relic Syntheticsのスクリプトとしてコピー＆ペーストして利用します。

---
**適用手順:**
1. New Relicプラットフォーム(https://login.newrelic.com)にログインする
2. ログイン後、左のメニュー群からSynthteics Monitoringにアクセスする
3. 右のモニター一覧の上部にある、"**Secure credentials**"にアクセスする
4. Secure credentials内にて、**MYACCOUNTID**というKEYで、ご利用になっているAcccount IDの値を設定する(例: 1234567)
5. Secure credentials内にて、**MYUSERAPIKEY**というKEYで、User Keyの値を設定する
6. Synthetics上で**Create monitor**ボタンを押し、**Scripted API**を選択する
7. 上記の作業にて、スクリプトを記載するUIになったら、pinger.jsの内容をコピー＆ペーストする
8. **Save monitor**ボタンを押し、設定内容を保存する

**適用手順での補足事項**
- 5番の作業を行う際に、4番で指定したAccount IDで発行されているUser Keyを設定する、あるいは新たに発行すること
- 6番の作業を行う際は、Runtimeは、**Node 16.10.0**あるいはそれよりも新しいバージョンを指定すること。また、Periodやlocationは任意の値を選択して問題ない
- 7番の作業を行う際に、カスタムEventスペース名を**CustomSyntheticsICMPPolling**としているが、必要であれば直接変更することができる。変更した場合、サンプルとしてあげるダッシュボードについても、内部で発行しているNRQLのクエリ対象(FROM句)についても適切に更新すること
- 8番を行う前に**Validate**を実施することを推奨する
- ICMPポーリング対象は、checksというリストに格納している。このリストに対して、ICMPポーリングを行いたい対象を登録し、不要な対象は削除する。**ip**で指定しているIPアドレスに直接ICMPポーリングを行い、**host**で指定している文字列で表示上のラベルとしている

---
**動作確認**
- Syntheticsの当該Scripted APIモニターの試行結果がSUCCESS rateが100%となっているかを確認する
- **Data explorer**にアクセスし、**CustomSysntheticsICMPPolling**が参照できるかを確認する

---
# ダッシュボード #
例
<img width="1002" alt="image" src="https://github.com/khara-NewRelic/syntheticsICMPPinger/assets/92971754/1732af67-36e6-4f0c-8185-100280039232">
