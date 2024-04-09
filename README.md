## はじめに ##
このレポジトリに入っているスクリプトは、サンプルとなっています。ご利用される方は、環境に併せてカスタマイズしてご利用頂くことを想定しています。

---
**利用目的:**

Syntheticにて、定期的にICMPポーリングを対象IPアドレス群に実施し、その結果をカスタムEventスペースに記録するための機能となっています。そのため、Synthetic上では対象モニターの実施結果がSUCCESSとなることを期待しており、モニター内部でのICMPポーリングの結果に寄らずに、適切にモニターの処理が稼働したということを表しています。また、各ICMPポーリングの結果については、カスタムEVENTスペースに格納しているので、NRQLやData explorerを活用して確認する必要があります。(別途、ダッシュボード化についての情報も追記予定)

pinger.js: 
このファイル内容をNew Relic Syntheticのスクリプトとしてコピー＆ペーストして利用します。

---
**事前準備**
- 利用しているAccount IDを確認する
    - 以下のドキュメンの手順に沿って、Account IDの値を確認する(例: 1234567)
    https://docs.newrelic.com/jp/docs/accounts/accounts-billing/account-structure/account-id/

- Event送信する際に利用するAPI Keyを確認あるいは新規作成する
    - 以下のドキュメントの手順に沿って、API Keyを確認する、あるいは新規で作成する(INGEST - LICENSEタイプを選択する)
    https://docs.newrelic.com/jp/docs/apis/intro-apis/new-relic-api-keys/
    **補足:** API Keyを確認や作成を行う際に、利用するAccount IDに紐づけていること

**適用手順:**
1. New Relicプラットフォーム( https://login.newrelic.com )にログインする
2. ログイン後、左のメニュー群からSynthteics Monitoringにアクセスする
3. 右のモニター一覧の上部にある、"**Secure credentials**"にアクセスする
4. Secure credentials内にて、**MYACCOUNTID**というKEYで、ご利用になっているAcccount IDの値を設定する
5. Secure credentials内にて、**MYINGESTAPIKEY**というKEYで、事前準備したAPI Key(INGEST - LICENSEタイプ)の値を設定する
6. Synthetic上で**Create monitor**ボタンを押し、**Scripted API**を選択する
    - Runtimeは、**Node 16.10.0**あるいはそれよりも新しいバージョンを指定すること
    - Periodやlocationは任意の値を選択して問題ない
7. 上記の作業にて、スクリプトを記載するUIになったら、pinger.jsの内容をコピー＆ペーストする
    - ICMPポーリング対象は、checksというリストに格納している
        - このリストに対して、ICMPポーリングを行いたい対象を登録し、不要な対象は削除する
        - **ip**で指定しているIPアドレスに直接ICMPポーリングを行い、**host**で指定している文字列で表示上のラベルとしている
    - カスタムEventスペース名を**CustomSyntheticICMPPolling**としているが、必要であれば直接変更することができる
       - 変更した場合、サンプルとしてあげるダッシュボードについても、内部で発行しているNRQLのクエリ対象(FROM句)についても適切に更新すること
8. 【実施を強く推奨】**Validate**を実施し、処理が成功することを確認する
9. **Save monitor**ボタンを押し、設定内容を保存する

---
**動作確認**
- Syntheticの当該Scripted APIモニターの試行結果がSUCCESS rateが100%となっているかを確認する
- **Data explorer**にアクセスし、**CustomSysntheticICMPPolling**が参照できるかを確認する

---
# ダッシュボード #
例
<img width="1284" alt="image" src="https://github.com/khara-NewRelic/syntheticsICMPPinger/assets/92971754/ae35e188-a563-4bc5-8e07-1b068801fd93">

---
**変更履歴:**
2024/03/26:
    pinger.jsにデバッグ用のdbug()関数とdebugmode変数を追加した。
    debugmode変数を**true**に変更することで、debug()関数がconsoleにログを残す挙動をとる。今後はdebug()関数を更に内部に記載予定。

2024/03/26:
    sessionのクローズ時やエラー発生時にdebug()関数経由でコンソールにログを残す様に変更を実施した。
2024/04/01:
    async/awaitを適用することによるコードの修正を実施した。
