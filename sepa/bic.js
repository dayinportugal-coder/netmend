/* Bank code → BIC for optional auto-fill. Self-hosted. Nothing is fetched.
   Portugal: the 4 digits in positions 5–8 of a PT IBAN are the financial-agent
   code assigned by Banco de Portugal (IBAN note:
   https://www.bportugal.pt/sites/default/files/anexos/documentos-relacionados/international_bank_account_number_pt.pdf ).
   The BIC is the one Banco de Portugal publishes for SICOI participants
   (list of 6 October 2026). Codes with no BIC on that list are omitted, so
   they are not guessed. 8-character form; the published list writes XXX for
   the optional branch.
   Spain: only participants in Banco de España TARGET RTGS whose BIC is
   published (NRBE code = first 4 digits of the Spanish BBAN):
   https://www.bde.es/f/webbe/Comunes/sispago/menu_dcha/TARGET_BE_NRBE.pdf
   A star in that PDF means the BIC was not published; those codes are omitted.
*/
var NetmendBic = {
  pt: {
    "0001": "BGALPTTG",
    "0007": "BESCPTPL",
    "0008": "BAIPPTPL",
    "0010": "BBPIPTPL",
    "0014": "IVVSPTPL",
    "0018": "TOTAPTPL",
    "0019": "BBVAPTPL",
    "0022": "BRASPTPL",
    "0023": "ACTVPTPL",
    "0033": "BCOMPTPL",
    "0034": "BNPAPTPL",
    "0035": "CGDIPTPL",
    "0036": "MPIOPTPL",
    "0043": "DEUTPTPL",
    "0045": "CCCMPTPL",
    "0047": "ESSIPTPL",
    "0048": "BFIAPTPL",
    "0059": "CEMAPTP2",
    "0061": "BDIGPTPL",
    "0063": "BNFIPTPL",
    "0064": "BPGPPTPL",
    "0065": "BESZPTPL",
    "0079": "BPNPPTPL",
    "0097": "CCCHPTP1",
    "0098": "CERTPTP1",
    "0160": "BESAPTPA",
    "0169": "CITIPTPX",
    "0170": "CAGLPTPL",
    "0189": "BAPAPTPL",
    "0191": "BNICPTPL",
    "0193": "CTTVPTPL",
    "0235": "BLJCPTPT",
    "0269": "BKBKPTPL",
    "0272": "WZNKPTPL",
    "0500": "BBRUPTPL",
    "0698": "UIFCPTPT",
    "0781": "IGCPPTPL",
    "0848": "BNPAPTPP",
    "0881": "ONIFPTP1",
    "0916": "CRBBPTP1",
    "0921": "CFFIPTP1",
    "3560": "REVOPTP2",
    "5180": "CDCTPTP2",
    "5200": "CDOTPTPP",
    "5340": "CTIUPTPP",
    "5564": "CAYCESM2",
    "7500": "SONVPTP1",
    "7837": "PRXBGRAA",
    "8115": "CTTPPTP1",
    "8703": "SIAOPTPL"
  },
  es: {
    "0011": "ALLFESMM",
    "0049": "BSCHESMM",
    "0061": "BMARES2M",
    "0078": "BAPUES22",
    "0081": "BSABESBB",
    "0083": "RENBESMM",
    "0128": "BKBKESMM",
    "0136": "AREBESMM",
    "0169": "NACNESMM",
    "0182": "BBVAESMM",
    "0186": "BFIVESBB",
    "0188": "ALCLESMM",
    "0198": "BCOEESMM",
    "0200": "DEGRESBB",
    "0211": "PROAESMM",
    "0219": "BMCEESMM",
    "0229": "POPLESMM",
    "0232": "INVLESMM",
    "0234": "CCOCESMM",
    "0235": "PICHESMM",
    "0240": "BCCAESMM",
    "0241": "AYGBESMM",
    "1000": "ICROESMM",
    "1479": "NATXESMM",
    "1497": "ESSIESMM",
    "1525": "BCDMESMM",
    "1544": "BACAESMM",
    "2000": "CECAESMM",
    "2045": "CECAESMM045",
    "2056": "CECAESMM056",
    "2080": "CAGLESMMVIG",
    "2085": "CAZRES2Z",
    "2095": "BASKES2B",
    "2100": "CAIXESBB",
    "2103": "UCJAES2M",
    "3025": "CDENESBB",
    "3035": "CLPEES2M",
    "3058": "CCRIES2A",
    "3081": "ERSVES22",
    "3183": "CASDESBB",
    "3669": "IVALESMM",
    "3682": "GVCBESBBETB",
    "3760": "IBGMESMM",
    "7415": "EDSXESM2",
    "9020": "IPAYESMMAS1",
    "9094": "MEFFESBBCCP",
    "9096": "IBRCESMM"
  },
  lookup: function (iban) {
    var v = String(iban || "").replace(/[\s.\-]/g, "").toUpperCase();
    if (v.slice(0, 2) === "PT" && v.length >= 8 && this.pt[v.slice(4, 8)]) return this.pt[v.slice(4, 8)];
    if (v.slice(0, 2) === "ES" && v.length >= 8 && this.es[v.slice(4, 8)]) return this.es[v.slice(4, 8)];
    return "";
  }
};
