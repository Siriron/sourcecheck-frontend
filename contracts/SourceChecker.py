# { "Depends": "py-genlayer:1jb45aa8ynh2a9c9xn3b7qqh8sm5q93hwfp7jqmwsfhh8jpz09h6" }
from genlayer import *
from dataclasses import dataclass
import json


@allow_storage
@dataclass
class CheckEntry:
    check_id:  u256
    submitter: str
    url:       str
    claim:     str
    verdict:   str
    summary:   str
    created_at: str

    def to_dict(self):
        return {
            "check_id":   str(self.check_id),
            "submitter":  self.submitter,
            "url":        self.url,
            "claim":      self.claim,
            "verdict":    self.verdict,
            "summary":    self.summary,
            "created_at": self.created_at,
        }


class SourceChecker(gl.Contract):
    checks:      TreeMap[u256, CheckEntry]
    check_count: u256

    def __init__(self):
        self.check_count = u256(0)

    # ── views ────────────────────────────────────────────────

    @gl.public.view
    def get_all_checks(self, limit: int) -> str:
        result = []
        count = 0
        for k, v in self.checks.items():
            if count >= limit:
                break
            result.append(v.to_dict())
            count += 1
        return json.dumps(result)

    @gl.public.view
    def get_check(self, check_id: int) -> str:
        idx = u256(check_id)
        if idx not in self.checks:
            return json.dumps({"error": "Not found"})
        return json.dumps(self.checks[idx].to_dict())

    @gl.public.view
    def get_total(self) -> str:
        return json.dumps({"total": str(self.check_count)})

    # ── write ────────────────────────────────────────────────

    @gl.public.write
    def submit_check(self, url: str, claim: str) -> None:
        url   = url.strip()
        claim = claim.strip()
        if not url:
            raise Exception("URL required")
        if not claim:
            raise Exception("Claim required")

        def leader_fn() -> str:
            evidence = ""
            try:
                r = gl.nondet.web.get(url)
                evidence = r.body.decode("utf-8")[:3000]
            except Exception as e:
                evidence = "FETCH_ERROR: " + str(e)

            prompt = (
                "You are a neutral fact-checker.\n"
                "Decide if the PAGE CONTENT supports the CLAIM.\n\n"
                "Reply ONLY in this exact format (one line):\n"
                "VERDICT=<LABEL>|<one sentence reason>\n\n"
                "LABEL must be exactly one of:\n"
                "SUPPORTED     — the page clearly supports the claim\n"
                "DISPUTED      — the page contradicts or does not support the claim\n"
                "UNVERIFIABLE  — could not fetch page, or claim cannot be verified\n\n"
                "CLAIM: " + claim + "\n\n"
                "PAGE CONTENT:\n" + evidence
            )
            return gl.nondet.exec_prompt(prompt)

        def validator_fn(leader_result) -> bool:
            if not isinstance(leader_result, gl.vm.Return):
                return False

            def parse_label(raw: str) -> str:
                raw = str(raw).strip()
                if "VERDICT=" in raw:
                    raw = raw.split("VERDICT=", 1)[1]
                label = raw.split("|")[0].strip().upper()
                if label in ("SUPPORTED", "DISPUTED", "UNVERIFIABLE"):
                    return label
                return "UNVERIFIABLE"

            my_raw         = leader_fn()
            leader_label   = parse_label(str(leader_result.calldata))
            validator_label = parse_label(my_raw)
            return leader_label == validator_label

        raw = gl.vm.run_nondet_unsafe(leader_fn, validator_fn)

        # parse outside nondet
        raw = str(raw).strip()
        if "VERDICT=" in raw:
            raw = raw.split("VERDICT=", 1)[1]
        label, _, summary = raw.partition("|")
        label   = label.strip().upper()
        summary = summary.strip()[:280]
        if label not in ("SUPPORTED", "DISPUTED", "UNVERIFIABLE"):
            label   = "UNVERIFIABLE"
            summary = "Could not determine verdict."

        new_id           = u256(int(self.check_count) + 1)
        self.check_count = new_id
        self.checks[new_id] = CheckEntry(
            check_id   = new_id,
            submitter  = str(gl.message.sender_address),
            url        = url,
            claim      = claim,
            verdict    = label,
            summary    = summary,
            created_at = gl.message_raw["datetime"],
        )
